const apiKey = "UX0oUh7ZWRuQW2qnng2rzw8U14zs2TmY9DYi8Eqs0SDQpo1wMe0l/BtVqaYcl7LYEJP0wysrk3xmQFgeE5iTJQ==";  // 디코딩된 서비스 키
const baseDate = "20250505";  // 예보 날짜 (예: 2025년 5월 5일)
const times = ["0100", "0600", "1100", "1600", "2100"];
const nx = "60";  // 지역 격자 x좌표 (예: 서울)
const ny = "127"; // 지역 격자 y좌표

const container = document.getElementById("weather-container");

async function fetchForecast(time) {
  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` +
              `?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON` +
              `&base_date=${baseDate}&base_time=0200&nx=${nx}&ny=${ny}`;
  
  const response = await fetch(url);
  const data = await response.json();
  const items = data.response.body.items.item;

  const forecast = {
    time,
    TMP: null, // 기온
    REH: null, // 습도
    POP: null, // 강수확률
    SKY: null  // 하늘 상태
  };

  for (let item of items) {
    if (item.fcstTime === time) {
      if (item.category === "TMP") forecast.TMP = item.fcstValue + "℃";
      if (item.category === "REH") forecast.REH = item.fcstValue + "%";
      if (item.category === "POP") forecast.POP = item.fcstValue + "%";
      if (item.category === "SKY") {
        forecast.SKY = item.fcstValue === "1" ? "☀️ 맑음" :
                       item.fcstValue === "3" ? "⛅ 구름" :
                       item.fcstValue === "4" ? "☁️ 흐림" : "";
      }
    }
  }

  return forecast;
}

async function renderForecasts() {
  container.innerHTML = "";
  for (let time of times) {
    const data = await fetchForecast(time);
    const item = document.createElement("div");
    item.className = "weather-item";
    item.innerHTML = `
      <strong>${time.slice(0, 2)}시</strong><br />
      날씨: ${data.SKY}<br />
      기온: ${data.TMP}<br />
      습도: ${data.REH}<br />
      강수확률: ${data.POP}
    `;
    container.appendChild(item);
  }
}

renderForecasts();
