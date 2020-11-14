import Jimp from 'jimp';
import React, { useState } from 'react';
import './App.css';
import { checkImageValid, convertToRGBA, mse } from './utils';

function Result(props) {
  const { result } = props;

  if (result === 0) return "Same Image";
  if (!result) return "No Image Compared"
  if (result < 1) return "Similar Image";
  return "Different Image";
}

function App() {

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  const [rmse, setRmse] = useState(null);

  const input1 = React.useRef();
  const img1Ref = React.useRef();
  const input2 = React.useRef();
  const img2Ref = React.useRef();

  function handleCompareButtonClick() {
    if (checkImageValid(img1Ref.current, img2Ref.current)) {
      new Jimp.read(img1Ref.current.src)
        .then(image1 => {
          new Jimp.read(img2Ref.current.src)
            .then(image2 => {
              let imageWidth = img1Ref.current.naturalWidth;
              let imageHeight = img1Ref.current.naturalHeight;

              let result = 0;

              for (let i = 0; i < imageWidth; i++) {
                for (let j = 0; j < imageHeight; j++) {
                  const pixel1 = convertToRGBA(image1.getPixelColor(i, j));
                  const pixel2 = convertToRGBA(image2.getPixelColor(i, j));

                  result += mse(pixel1, pixel2, imageWidth, imageHeight);
                }
              }

              setRmse(Math.sqrt(result));
            })
        })
    } else {
      alert("Your image do not have the same size")
    }
  }

  function handleUploadImage(event, index) {
    const { files } = event.target;

    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        const imgs = new Image();
        imgs.src = fr.result;

        imgs.onload = function () {
          if (index === 1) {
            setImg1({ src: fr.result, width: imgs.width, height: imgs.height });
          } else {
            setImg2({ src: fr.result, width: imgs.width, height: imgs.height });
          }
        }
        imgs.remove();
      }
      fr.readAsDataURL(files[0]);
    }
  }

  function handleUploadButtonClick(ref) {
    ref.current.click();
  }

  function handleGitHubBtnClick() {
    window.open(
      'https://github.com/stevan11leonardy/react-image-comparison',
      '_blank'
    )
  }

  return (
    <div className="container">
      <header>
        <h1>Image Comparison</h1>
      </header>
      <div className="preview-container">
        <div className="preview">
          <div className="image-wrapper">
            <img className="img" alt="" src={img1?.src} ref={img1Ref} />
            <span className="size">
              {`${img1?.width || 0} x ${img1?.height || 0}`}
            </span>
          </div>
          <input type="file" hidden accept="image/*" ref={input1} onChange={(ev) => handleUploadImage(ev, 1)} />
          <button className="upload-btn" onClick={() => handleUploadButtonClick(input1)}>Upload Image 1</button>
        </div>
        <div className="preview">
          <div className="image-wrapper">
            <img className="img" alt="" src={img2?.src} ref={img2Ref} />
            <span className="size">
              {`${img2?.width || 0} x ${img2?.height || 0}`}
            </span>
          </div>
          <input type="file" hidden accept="image/*" ref={input2} onChange={(ev) => handleUploadImage(ev, 2)} />
          <button className="upload-btn" onClick={() => handleUploadButtonClick(input2)}>Upload Image 2</button>
        </div>
      </div>
      <div className="comparison">
        <button className="compare-btn" id="compare-button" onClick={handleCompareButtonClick}>
          Compare Images
        </button>
        <p id="rmse">RMSE: {rmse || 0}</p>
        <p id="result">
          <Result result={rmse} />
        </p>
        <button className="github-btn" onClick={handleGitHubBtnClick}>
          View On Github
        </button>
      </div>
    </div>
  );
}

export default App;
