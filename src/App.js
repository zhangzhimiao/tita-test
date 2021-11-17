import { useState } from "react";
import COS from "cos-js-sdk-v5";

function App() {
  const [eTag, setETag] = useState();
  const [environment, setEnvironment] = useState('tita-data-test');

  const handleChangeSelect = (e) => {
    setEnvironment(e.target.value);
  }

  const getData = () => {
    var cos = new COS({
      SecretId: "AKIDpvpVx82g39zYqsdASVJr88sPkpfGciaK",
      SecretKey: "au9AwSidQzIMCpDNHvKUP5WifNp20iBP",
    });
    cos.getObject(
      {
        Bucket: "tita-data-test-1258713196" /* 必须 */,
        Region: "ap-beijing" /* 存储桶所在地域，必须字段 */,
        Key: environment /* 必须 */,
        IfNoneMatch: eTag,
      },
      function (err, data) {
        if (err) {
          return;
        }
        if (data.statusCode === 200) {
          const editor = window.editor;
          editor.setValue(JSON.parse(data.Body));
          setETag(JSON.parse(data.ETag));
        }
      }
    );
  };
  const uploadData = () => {
    const editor = window.editor;
    const value = editor.getValue();
    var cos = new COS({
      SecretId: "AKIDpvpVx82g39zYqsdASVJr88sPkpfGciaK",
      SecretKey: "au9AwSidQzIMCpDNHvKUP5WifNp20iBP",
    });
    cos.putObject(
      {
        Bucket: "tita-data-test-1258713196",
        Region: "ap-beijing",
        Key: environment,
        StorageClass: "STANDARD",
        Body: JSON.stringify(value), // 上传文件对象
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData));
        },
      },
      function (err, data) {
        if (err) {
          return;
        }
      }
    );
  };
  return (
    <div className="App">
      <select defaultValue='tita-data-test' onChange={handleChangeSelect}>
        <option value="tita-data-test">
          测试环境
        </option>
        <option value="tita-data-prod">线上环境</option>
      </select>
      <button onClick={uploadData}>提交</button>
      <button onClick={getData}>下载</button>
    </div>
  );
}

export default App;
