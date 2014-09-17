app.directive('chart', function(chartGenerator, $rootScope) {
  "use strict";
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {

      scope.$watch('ptoList', updateChart, true);
      scope.$watch('startingBalance', updateChart, true);

      function updateChart() {
        var data = chartGenerator.getChartData();

        var dlb = data.lostBalance[data.lostBalance.length - 1];
        var dpb = data.ptoBalance[data.ptoBalance.length - 1];
        $rootScope.lostBalance = Math.floor( dlb[1] );
        $rootScope.ptoBalance = Math.floor( dpb[1] );

        $.plot(elem, [{
            data: data.ptoBalance,

            label: "PTO Balance",
            lines: {
              show: true
            }
          }, {
            data: data.lostBalance,
            label: "Unused Balance",
            lines: {
              show: true
            },
            points: {
              symbol: "triangle"
            }
          }
          //, {
          //     data: $rootScope.holidays,
          //     label: "Holiday",
          //     points: {
          //         symbol: "diamond"
          //     }
          // }
        ], {
          xaxis: {
            //tickSize:[".5", "month"],
            mode: "time"
          },
          grid: {
            markings: [{
              yaxis: {
                from: 80,
                to: 80
              },
              lineWidth: 4,
              color: "#dbb"
            }, {
              xaxis: {
                from: $rootScope.gettime,
                to: $rootScope.gettime
              },
              lineWidth: 4,
              color: "#bdb"
            }],
            borderWidth: {
              top: 1,
              right: 1,
              bottom: 1,
              left: 1
            },
            borderColor: {
              top: "#ccc",
              right: "#ccc",
              bottom: "#ccc",
              left: "#ccc"
            },
            //clickable: true,
            //autoHighlight: true,
            hoverable: true
          },
          series: {
            points: {
              //symbol: "square", // or "diamond", "triangle", "cross"
              //radius: 3,
              show: true
            },
            lines: {
              lineWidth: 2
            },
            shadowSize: 0
          },
          colors: ["orange", "#19f", "#cb4b4b", "#4da74d", "#9440ed"]
        });

        $(elem).bind("plothover", function(event, pos, item) {
          if (item) {
            var x = new Date(item.datapoint[0]),
              y = (item.series.label !== "Holiday") ? " = " + item.datapoint[1].toFixed(2) : '';

            $("#tooltip").html(item.series.label + " - " + x.toDateString() + y)
              .css({
                top: item.pageY - 12,
                left: item.pageX + 22
              })
              .show();
          } else {
            $("#tooltip").hide();
          }
        });
        //$(elem).bind("plotclick", function(event, pos, item) {
        //});
      }
    }
  };
});
