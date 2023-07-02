import os.path
import mysql.connector
from fastapi import FastAPI, UploadFile, File, Query
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import uuid
from typing import List
from Process import ProcessModel
from pydantic import BaseModel


class SQL:
    def __init__(self):
        self.connection = None
        self.cursor = None
        self.setup_connection()

    def setup_connection(self):
        self.connection = mysql.connector.connect(
            host="106.13.12.84",
            user="cjm",
            password="hF42bj56EhJermDp",
            database="cjm"
        )
        self.cursor = self.connection.cursor()
        return

    def insert_query(self, filename, ocr_result):
        # print()
        sql_cmd = "INSERT INTO main(file_name, ocr_result, cor_result) VALUES('%s', '%s', '')" % (filename, ocr_result.replace("'", r"\'").replace("'", r"\""))
        self.run_sql(sql_cmd)
        self.connection.commit()
        last_inserted_id = self.cursor.lastrowid
        self.cursor.close()
        return last_inserted_id

    def update_correction(self, update_id, content):
        sql_cmd = "UPDATE main set cor_result='%s' where id=%s" % (content, update_id)
        self.run_sql(sql_cmd)
        self.connection.commit()
        return "yes"

    # def exe_query(self, method, sql_seq):
    #     if method == "POST":
    #         self.run_sql(sql_seq)
    #         self.connection.commit()
    #         last_inserted_id = self.cursor.lastrowid
    #         # print("Last inserted ID:", last_inserted_id)
    #         self.cursor.close()
    #         return last_inserted_id

    def run_sql(self, sql_seq):
        try:
            self.cursor.execute(sql_seq)
        except Exception as error:
            self.setup_connection()
            self.cursor.execute(sql_seq)
        return


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
sql = SQL()
pm = ProcessModel()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/ocrs")  # 多张图片上传识别
async def perform_ocr_s(images: List[UploadFile] = File(...)):
    image_path = os.path.abspath("./image")
    if not os.path.exists(image_path):
        os.mkdir(image_path)

    def get_random_name():
        return uuid.uuid4().__str__()

    result_list = []
    for image in images:
        file_name = get_random_name()
        file_path = os.path.join(image_path, file_name + ".png")
        with open(file_path, "wb") as f:
            f.write(image.file.read())
        ocr_result, uncertainty = pm.process_image(file_path)
        ocr_result = ocr_result['text_sequence']
        # ocr_result = "name"
        query_id = sql.insert_query(file_name, ocr_result)
        result_list.append({
            "sentence_uncertainty": uncertainty,
            "query_id": query_id,
            "ocr_result": ocr_result
        })

    # result_list = sorted(result_list, key=lambda x: x["sentence_uncertainty"], reverse=True)

    return {
        "result_list": result_list
    }


class UpdateModel(BaseModel):
    text: str = ""


@app.post("/cor/{query_id}")
async def correction(query_id: str, update_model: UpdateModel):
    sql.update_correction(update_id=query_id, content=update_model.text)
    return "True"


@app.post("/ocr")
async def perform_ocr(image: UploadFile = File(...)):
    def get_random_name():
        return uuid.uuid4().__str__()
        # return uuid.uuid5(uuid.NAMESPACE_DNS, name)

    image_path = os.path.abspath("./image")
    if not os.path.exists(image_path):
        os.mkdir(image_path)
    file_name = get_random_name()

    file_path = os.path.join(image_path, file_name + ".png")
    with open(file_path, "wb") as f:
        f.write(image.file.read())
    ocr_result = pm.process_image(file_path)
    query_id = sql.insert_query(file_name, ocr_result)
    return {
        "query_id": query_id,
        "ocr_result": ocr_result
    }


# @app.get("/hello/{name}")
# async def say_hello(name: str):
#     return {"message": f"Hello {name}"}

if __name__ == "__main__":
    uvicorn.run(app="main:app", host="0.0.0.0", port=5000, reload=True)
