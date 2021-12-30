import axios from "axios";

export class Translator {
  translate(text, _source, _target) {
    const source = _source || "ko";
    const target = _target || "en";
    return new Promise((resolve, reject) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          {
            ko: "korean",
            en: "english",
            es: "spanish",
            ja: "japanese",
            "zh-CN": "chinese",
            th: "thai",
            fr: "french",
            vi: "vietnamese",
            id: "hindi",
          },
          source
        ) ||
        !Object.prototype.hasOwnProperty.call(
          {
            ko: "korean",
            en: "english",
            es: "spanish",
            ja: "japanese",
            "zh-CN": "chinese",
            th: "thai",
            fr: "french",
            vi: "vietnamese",
            id: "hindi",
          },
          target
        )
      ) {
        reject(new Error("This languages is not supported"));
      }
      const options = {
        method: "POST",
        url: "https://capstone-ontact.herokuapp.com/stt",
        data: {
          source: source,
          target: target,
          text: text,
        },
        headers: {
          Accept: "application/json",
        },
      };
      axios(options)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error");
          reject(err);
        });
    });
  }
}

export const EntoKo = async (text) => {
  const translator = new Translator();
  let resultText = "";

  try {
    const result = await translator.translate(text, "en", "ko");
    resultText = result.data;
  } catch (err) {
    resultText = err.code;
  } finally {
    return resultText;
  }
};

export const KotoEn = async (text) => {
  const translator = new Translator();
  let resultText = "";

  try {
    const result = await translator.translate(text, "ko", "en");
    resultText = result.data;
  } catch (err) {
    resultText = err.code;
  } finally {
    return resultText;
  }
};
