import React, { useEffect, useRef, useState } from 'react';
import { updateProcess } from './Out';

const ImageUploader = ({ index, setIndex, list, setList, inputs, setInputs, setResults }) => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageSize, setImageSize] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (index == null || !list.length) return;
    const selectedImage = list[index];
    if (!selectedImage) {
      return;
    }
    setImage(selectedImage);
    setImageName(selectedImage.name);
    setImageSize(selectedImage.size);
    updateProcess("123");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(selectedImage);
  }, [index, list])

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) return;
    setList(e.target.files);
    setResults(new Array(e.target.files.length));
    setInputs(new Array(e.target.files.length));
    setIndex(0);
  };

  return (
    <div className='ImageUploader'>
      <div className='img'>
        {<input type="file" id="imageInput" multiple={true} onChange={handleImageChange} style={{ display: 'none' }} />}
        {image && <img src={URL.createObjectURL(image)} alt={imageName} />}
        {image ?
          <div className={["upload", "hide"].filter(e => e).join(' ')} onContextMenu={() => { window.open("").document.body.innerHTML = `<img src=${URL.createObjectURL(image)} alt=${imageName} />`; return false; }} onMouseUp={(e) => e.button == 0 && document.getElementById('imageInput').click()}>
            {"右键查看大图/左键上传图片"}
          </div>
          :
          <div className={["upload", image && "hide"].filter(e => e).join(' ')} onMouseUp={(e) => e.button == 0 && document.getElementById('imageInput').click()}>
            {"Upload Images"}
          </div>
        }
      </div>
      <div className='info'>
        {image ? <>{imageName} {parseInt(imageSize / 1024)}KB {imageDimensions.width}x{imageDimensions.height}</> : <></>}
      </div>
      {/* {image && <input type="file" id="imageInput" multiple={true} onChange={handleImageChange} style={{ display: 'none' }} />} */}
      <div className='list-bar'>
        <div className='list' style={{ width: (inputs.length * 1.1 - .1) + "rem" }}>
          {list?.length !== 0 && Array.from(list).map((e, i) => {
            return <div className={['item', (index === i) && "active"].filter(e => e).join(' ')}
              onClick={() => (setIndex(i))} key={i}>
              <img src={URL.createObjectURL(e)} alt={e.name} />
            </div>
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;