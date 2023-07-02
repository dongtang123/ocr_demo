import os.path

import torch
import re
from transformers import DonutProcessor, VisionEncoderDecoderModel
from PIL import Image

path = os.path.join("D:\\donut\\donut-base\\donut-base")


class ProcessModel:
    def __init__(self):
        model_path = path
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.task_prompt = "<s_base>"
        self.processor = DonutProcessor.from_pretrained(model_path)
        self.decoder_input_ids = self.processor.tokenizer(self.task_prompt, add_special_tokens=False,
                                                          return_tensors="pt").input_ids.to(self.device)

        self.model = VisionEncoderDecoderModel.from_pretrained(model_path).to(self.device)

    def process_image(self, image_path):
        image = Image.open(image_path)
        pixel_values = self.processor(image, return_tensors="pt").pixel_values

        outputs = self.model.generate(
            pixel_values.to(self.device),
            decoder_input_ids=self.decoder_input_ids,
            max_length=self.model.decoder.config.max_position_embeddings,
            early_stopping=True,
            pad_token_id=self.processor.tokenizer.pad_token_id,
            eos_token_id=self.processor.tokenizer.eos_token_id,
            use_cache=True,
            num_beams=1,
            bad_words_ids=[[self.processor.tokenizer.unk_token_id]],
            return_dict_in_generate=True,
        )

        token_tensor_softmax = []
        for token_tensor_i in outputs.token_tensor:
            top_values, top_indices = torch.topk(token_tensor_i, k=5)  # 取出top_k大小的值和对应的位置,但是结果按值的大小排序，不保留原有关系
            contains_inf = torch.any(torch.isinf(top_values))
            if contains_inf == False:
                top_values = torch.softmax(top_values, dim=-1)
                # print(top_values)
                token_tensor_softmax.append(top_values)

        entropy_list = []
        for softmax_values in token_tensor_softmax:
            entropy = torch.sum(-softmax_values * torch.log2(softmax_values))
            # print(entropy.item())
            entropy_list.append(entropy.item())

        sentence_uncertain = sum(entropy_list) / len(entropy_list)
        # print(sentence_uncertain)
        sequence = self.processor.batch_decode(outputs.sequences)[0]
        sequence = sequence.replace(self.processor.tokenizer.eos_token, "").replace(self.processor.tokenizer.pad_token,
                                                                                    "")
        sequence = re.sub(r"<.*?>", "", sequence, count=1).strip()  # remove first task start token
        torch.cuda.empty_cache()
        return self.processor.token2json(sequence), sentence_uncertain


if __name__ == "__main__":
    pm = ProcessModel()
    result = pm.process_image("./2.png")
    #print(result)
