const API_KEY = "UX0oUh7ZWRuQW2qnng2rzw8U14zs2TmY9DYi8Eqs0SDQpo1wMe0l/BtVqaYcl7LYEJP0wysrk3xmQFgeE5iTJQ==";
const forecastContainer = document.getElementById("forecast");

const baseDate = "20250505";
const times = ["0100", "0400", "0700", "1000", "1300", "1600", "1900", "2200"];

async function fetchWeather() {
  let html = "";

  for (let time of times) {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=0500&nx=61&ny=120`;

    const res = await fetch(url);
    const data = await res.json();
    const items = data.response.body.items.item;

    const filtered = items.filter(i => i.fcstTime === time);

    const temp = filtered.find(i => i.category === "TMP")?.fcstValue ?? "N/A";
    const hum = filtered.find(i => i.category === "REH")?.fcstValue ?? "N/A";
    const rain = filtered.find(i => i.category === "POP")?.fcstValue ?? "N/A";

    html += `
      <div class="forecast-item">
        <h3>${time.slice(0, 2)}시 예보</h3>
        <p>기온: ${temp}℃</p>
        <p>습도: ${hum}%</p>
        <p>강수확률: ${rain}%</p>
      </div>
    `;
  }

  forecastContainer.innerHTML = html;
}

fetchWeather();
