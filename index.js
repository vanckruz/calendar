
$(document).ready(() => {
  writeCodeCountries();
  initCalendar("#calendar", 2018, false, {});
  showResults();
});

function writeCodeCountries() {
  let optionsCode = COUNTRIES_CODE.map((element) => {
    return $("<option>", {
      "value": element.code,
      "html": element.name
    });
  });
  $("#countrycode").html(optionsCode);
}

function showResults() {

  $("#count").click(() => {
    if ($("#start").val() != "" && $("#days").val() != "") {
      let start = moment($("#start").val(), ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"]);
      let days = $("#days").val();
      let count = moment($("#start").val(), ["YYYY-MM-DD", "MM-DD-YYYY", "DD-MM-YYYY"]).add(days, "d");

      $("#result").html(`<b>Start date:</b> ${start.format("MM-DD-YYYY")} <b>Final date:</b> ${count.format("MM-DD-YYYY")}`);

      let startYear = parseInt(start.format("YYYY"));
      let endYear = parseInt(count.format("YYYY"));

      let years = 0;
      if(startYear !== endYear){
        years = endYear - startYear;
      }

      if(years > 0){
        $("#calendar").html("");
        for (let y = 0; y <= years; y++) {
          initCalendar("#calendar", startYear++, true, {start, count});
        }
      }else{
        $("#calendar").html("");
        initCalendar("#calendar", startYear, true, {start, count});
      }

      console.log("año", years)

    } else {
      alert("enter range of date");
    }
  });
}

function initCalendar(calendario, globalYear, rebuild, range) {
  var calendarbox = $("<div>", {
    "class": "row calendarbox",
    "data-year": globalYear
  })
  $(calendario).append([    
    $("<div>",{
    "html": globalYear,
    "class": "yearTitle row"
  }),
    calendarbox
  ]);
  for (let m = 0; m <= 11; m++) {
    
    let month = $("<div>", {
      "class": "month col-xs-4"
    });

    $(calendarbox).append(month);

    let monthTable = $("<table>",{
      "class": "tableformonth_"+globalYear
    });
    month.append(monthTable);

    let month_name = $("<caption>",{
      "class": "month_name",
      "text": MONTHS[m].short
    });

    let day = [];
    for (let d = 0; d < 7; d++) {
      day.push($("<th>",{
        "text": DAYS[d].short
      }));
    }
    let thead = $("<thead>").append($("<tr>",{}).append($("<td>").append(month_name)),$("<tr>").append(day));
    let tbody = $("<tbody>", {});

    for (let row = 0; row < 6; row++) {
      let run_days = [];
      for (let d = 0; d < 7; d++) {
        run_days.push($("<td>",{
          "text": "",
          "class": "cellday"
        }));
      }     
      let row_html = $("<tr>", {}).append(run_days);
      tbody.append(row_html);
    }    
    monthTable.append([thead, tbody]);
  }
  enumerate(globalYear, rebuild, range);
}

function enumerate(year, rebuild, range) {
  for (let i = 1; i < 366; i++) {
    let currentDate = dateByDay(year, i);
    let indexMonth = currentDate.getMonth();
    let month_table = document.getElementsByClassName('tableformonth_'+year)[indexMonth];
    let day = currentDate.getDate();
    let week_day = currentDate.getDay();
    if (day == 1) {var week = 0;}
    let currentDay = new Date(Date.now());
    let cellDay = $(month_table.children[1].children[week].children[week_day]);
    
    if(rebuild){
      if(week_day === 0 || week_day === 6){
        cellDay.css("background", "yellow");
      }else{
        cellDay.css("background", "green");
      }

      if(Math.round(currentDate.getTime()/1000) < range.start.unix()) 
      {
        cellDay.css("background", "grey");
      }

      if(Math.round(currentDate.getTime()/1000) > range.count.unix()){
        cellDay.css("background", "grey");
      }
      console.log("val2",Math.round(currentDate.getTime()/1000) > range.start.unix());
      console.log("result",Math.round(currentDate.getTime()/1000) ," ", range.start.unix());
    }

    if(day === currentDay.getDate() && indexMonth === currentDay.getMonth() && currentDate.getYear() === currentDay.getYear()){
      cellDay.css("background", "purple");
    }

    cellDay.html(day);
    console.log(rebuild, "text: ", day);

    if (week_day == 6) { week = week + 1; }
  }
}

function dateByDay(year, day) {
  var date = new Date(year, 0);
  return new Date(date.setDate(day));
}