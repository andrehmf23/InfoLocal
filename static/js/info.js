let allData = {};

let chartECONOMY = null;
let chartGENRE = null;
let chartNATALITYandMORTALITY = null;
let chartEDUCATIONandHEALTH = null;
let chartAMBIENTandENERGY = null;
let chartPOPULATION = null;

/*
[
//chartECONOMY
  "NY.GDP.MKTP.CD",
  "NY.GNP.PCAP.CD",
  "SL.UEM.TOTL.ZS",

//chartGENRE
  "SP.POP.TOTL", Extra
  "SP.POP.TOTL.MA.IN",
  "SP.POP.TOTL.FE.IN",

//chartEDUCATIONandHEALTH
  "SE.XPD.TOTL.GD.ZS",
  "SH.XPD.CHEX.GD.ZS",

//chartAMBIENTandENERGY
  "EG.USE.ELEC.KH.PC",
  "AG.LND.FRST.ZS",

//chartNATALITYandMORTALITY
  "SP.DYN.CBRT.IN",
  "SP.DYN.CDRT.IN",

]
*/

const indicatorColors = {
  "NY.GDP.MKTP.CD": "gray",
  "NY.GNP.PCAP.CD": "purple",
  "SL.UEM.TOTL.ZS": "darkgreen",

  "SE.XPD.TOTL.GD.ZS": "orange",
  "SH.XPD.CHEX.GD.ZS": "red",

  "EG.USE.ELEC.KH.PC": "yellow",
  "AG.LND.FRST.ZS": "green",

  "SP.DYN.CBRT.IN": "darkred",
  "SP.DYN.CDRT.IN": "darkblue",

  "SP.POP.TOTL.MA.IN": "darkred",
  "SP.POP.TOTL.FE.IN": "darkyellow",
  "SP.POP.TOTL": "cyan"
}

const indicatorNames = {
  "NY.GDP.MKTP.CD": "PIB (GDP)",
  "SP.POP.TOTL": "População",
  "SL.UEM.TOTL.ZS": "Taxa de desemprego (%)",
  "NY.GNP.PCAP.CD": "PNB per capita (US$ corrente)",
  "SE.XPD.TOTL.GD.ZS": "Despesa com educação (%)",
  "SH.XPD.CHEX.GD.ZS": "Despesa com saude (%)",
  "EG.USE.ELEC.KH.PC": "Consumo de energia (em kWh)",
  "AG.LND.FRST.ZS": "Agricultura (%)",
  "SP.DYN.CBRT.IN": "Taxa de mortalidade (%)",
  "SP.DYN.CDRT.IN": "Taxa de natalidade (%)",
  "SP.POP.TOTL.MA.IN": "População masculina",
  "SP.POP.TOTL.FE.IN": "População feminina",
  "SP.POP.TOTL": "População total"
}


async function getIndicatorData(countryCode, indicator) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=100`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 1) {
    return data[1]
      .filter(item => item.value !== null)
      .map(item => ({ value: item.value, date: item.date }));
  } else {
    return [];
  }
}

async function getEconomyData(countryCode, indicators) {

  const promises = indicators.map(indicator => getIndicatorData(countryCode, indicator));

  const results = await Promise.all(promises);
  
  indicators.forEach((ind, i) => {
    allData[ind] = results[i];
  });
}

function createChartLine(data, label, type, id) {
  const ctx = document.getElementById(id).getContext('2d');
  const labels = data.map(d => d.date).reverse();
  const values = data.map(d => d.value).reverse();

  return new Chart(ctx, {
    type: type || 'line',
    data: {
      labels: labels,
      datasets: [{
        label: indicatorNames[label],
        data: values,
        borderColor: indicatorColors[label] || 'black',
        backgroundColor: indicatorColors[label] || 'black',
        fill: true,
      }]
    },
    options: {
      responsive: false,
        plugins: {
            legend: {
            display: false
            }
        },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}


function createChartLines(data, names, type, id) {
  const ctx = document.getElementById(id).getContext('2d');
  console.log("Names: ", names);
  console.log("Data: ", data);

  return new Chart(ctx, {
    type: type || 'line',
    data: {
      labels: data[0].map(d => d.date).reverse(),
      datasets: names.map((name, i) => ({
        label: indicatorNames[name],
        data: data[i].map(d => d.value).reverse(),
        borderColor: indicatorColors[name] || 'black',
        backgroundColor: indicatorColors[name] || 'black',
      }))
    },
    options: {
      responsive: false,
        plugins: {
            legend: {
            display: true
            }
        }
    }
  });
}

function createChartPie(id, labels, values, label, colors) {
  const ctx = document.getElementById(id).getContext('2d');

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        borderColor: colors,
        backgroundColor: colors,
        fill: true,
      }]
    },
    options: {
      responsive: false,
        plugins: {
          legend: {
            display: false // esconde a legenda
          }
        },
        scales: {
          x: {
            display: false, // remove eixo X
            grid: {
              display: false // remove grade vertical
            }
          },
          y: {
            display: false, // remove eixo Y
            grid: {
              display: false // remove grade horizontal
            }
          }
        }
    }
  });
}

// Economy

document.getElementById('indicatorFormECONOMY').addEventListener('change', (e) => {
  if (e.target.name === 'indicator') {
    const ind = e.target.value;
    if (chartECONOMY) {
      chartECONOMY.destroy();
    }
    chartECONOMY = createChartLine(allData[ind], ind, 'bar', 'chartECONOMY');
  }
});

document.getElementById('indicatorFormEDUCATIONandHEALTH').addEventListener('change', (e) => {
  if (e.target.name === 'indicator') {
    const ind = e.target.value;
    if (chartEDUCATIONandHEALTH) {
      chartEDUCATIONandHEALTH.destroy();
    }
    chartEDUCATIONandHEALTH = createChartLine(allData[ind], ind, 'bar', 'chartEDUCATIONandHEALTH');
  }
});

document.getElementById('indicatorFormAMBIENTandENERGY').addEventListener('change', (e) => {
  if (e.target.name === 'indicator') {
    const ind = e.target.value;
    if (chartAMBIENTandENERGY) {
      chartAMBIENTandENERGY.destroy();
    }
    chartAMBIENTandENERGY = createChartLine(allData[ind], ind, 'scatter', 'chartAMBIENTandENERGY');
  }
});

getEconomyData(
  localStorage.getItem("countryCode"), 
  [
    "NY.GDP.MKTP.CD",
    "SP.POP.TOTL",
    "SL.UEM.TOTL.ZS",
    "NY.GNP.PCAP.CD",
    "SE.XPD.TOTL.GD.ZS",
    "SH.XPD.CHEX.GD.ZS",
    "EG.USE.ELEC.KH.PC",
    "AG.LND.FRST.ZS",
    "SP.DYN.CBRT.IN",
    "SP.DYN.CDRT.IN",
    "SP.POP.TOTL.MA.IN",
    "SP.POP.TOTL.FE.IN",
    "SP.POP.TOTL"
  ]).then(() => {
    // Inicialização
    chartECONOMY = createChartLine(allData["NY.GDP.MKTP.CD"], "NY.GDP.MKTP.CD", 'bar', 'chartECONOMY');
    //console.log("População masculina: ", allData["SP.POP.TOTL.MA.IN"]);
    chartGENRE = createChartPie('chartGENRE', 
      ["Masculino", "Feminino"],
      [allData["SP.POP.TOTL.MA.IN"][0].value, allData["SP.POP.TOTL.FE.IN"][0].value],
      "População masculina e fe", 
      ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
    );

    chartPOPULATION = createChartLine(allData["SP.POP.TOTL"], "SP.POP.TOTL", 'line', 'chartPOPULATION');
    chartEDUCATIONandHEALTH = createChartLine(allData["SE.XPD.TOTL.GD.ZS"], "SE.XPD.TOTL.GD.ZS", 'bar', 'chartEDUCATIONandHEALTH');
    chartAMBIENTandENERGY = createChartLine(allData["EG.USE.ELEC.KH.PC"], "EG.USE.ELEC.KH.PC", 'scatter', 'chartAMBIENTandENERGY');
    chartNATALITYandMORTALITY = createChartLines([allData["SP.DYN.CBRT.IN"], allData["SP.DYN.CDRT.IN"]], ["SP.DYN.CBRT.IN", "SP.DYN.CDRT.IN"], 'line', 'chartNATALITYandMORTALITY');
});