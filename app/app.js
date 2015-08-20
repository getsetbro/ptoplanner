
var app = angular.module('ptoPlanner', []);

app.run(function($rootScope) {
"use strict";

    var newDate = new Date();
    var curYear = newDate.getFullYear();
    var curQuarter = parseInt(newDate.getMonth() / 3) + 1;
    //var datepickers for reuse
    var $fromDP = $("#from");
    var $toDP = $("#to");

    $rootScope.nowDate = newDate;
    $rootScope.gettime = newDate.getTime();
    $rootScope.getFullYear = curYear;
    $rootScope.curQuarter = curQuarter;

    $rootScope.ptoBalance = 0;
    $rootScope.lostBalance = 0;
    $rootScope.todateHoursAvailable = 0;
    $rootScope.todateHoursLost = 0;

    function getLastMonday(month) {
      var d = new Date();
      d.setDate(1); // Roll to the first day of ...
      d.setMonth(month);//the month after because of zero base
      do { // Roll the days backwards until Monday.
        d.setDate(d.getDate() - 1);
      } while (d.getDay() !== 1);

      return new Date( curYear, d.getMonth(), d.getDate() );
    }

    function getThanksDay() {
        var first = new Date(curYear, 10, 1);
        var day_of_week = first.getDay();
        var thanksday = 22 + (11 - day_of_week) % 7;
        return new Date(curYear,10,thanksday);
    }

    function getHoliday(y,m,d){
      var date = new Date(y,m,d);
      //push sunday to monday
      if(date.getDay() === 0){
        date.setDate(date.getDate() + 1);
      }
      //push saturday to friday
      if(date.getDay() === 6){
        date.setDate(date.getDate() - 1);
        //if new years moved to previous year push it the other way
        if(date.getDate() === 31){
          date.setDate(date.getDate() + 3);
        }
      }
      return date;
    }

    // Memorial Day | Last Monday in May
    // Labor Day | First Monday in Sept
    // Thanksgiving Day | Last Thursday in Nov
    $rootScope.h1 = getHoliday(curYear,0,1);   // New Year's Day
    $rootScope.h2 = getLastMonday(5);// memorial may monday
    $rootScope.h3 = getHoliday(curYear,6,4);   // Independence Day
    $rootScope.h4 = getLastMonday(9);// labor sep monday
    $rootScope.h5 = getThanksDay();// thanks nov thursday
    $rootScope.h6 = getHoliday(curYear,11,25); // Christmas Day

    Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
    };
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    };

    // Namespace: Windows.UI.Notifications
    if (typeof Windows !== 'undefined' && typeof Windows.UI !== 'undefined' && typeof Windows.UI.Notifications !== 'undefined') {

      // Subscribe to the Windows Activation Event
      var activation = Windows.ApplicationModel.Activation;
      var notifications = Windows.UI.Notifications;

      Windows.UI.WebUI.WebUIApplication.addEventListener("activated", function (args) {
        
        if (args.kind === activation.ActivationKind.voiceCommand) {
          //$('body').append("<br>The activation kind: " + args.kind);
          //$('body').append("<br>This is the kind for voice activation: " + activation.ActivationKind.voiceCommand);
          //console.dir(args);

          var speechRecognitionResult = args.result;
          // Speech reco result
          //$('body').append("<br>This is the speech reco test result: " + speechRecognitionResult.text);
          //$('body').append("<br>This is the command .rulePath: " + speechRecognitionResult.rulePath[0]);
          //console.log("This is the command: " + speechRecognitionResult.RulePath[0]);
          // Speech reco result
          //console.dir(speechRecognitionResult);
          // The name of the voice command
          if (speechRecognitionResult.rulePath[0] === "appendNote") {
            //$('body').append("<br>addNote rule: " + speechRecognitionResult.rulePath[0]);
            //$('body').append("<br>appendNote note from Cortana: " + speechRecognitionResult.text);
            var template = notifications.ToastTemplateType.toastImageAndText01;
            var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);
            var toastTextElements = toastXml.getElementsByTagName("text");
            toastTextElements[0].appendChild(toastXml.createTextNode('You told Vacation Planner "' + speechRecognitionResult.text + '"'));
            var toastImageElements = toastXml.getElementsByTagName("image");
            toastImageElements[0].setAttribute("src", "http://getsetbro.com/ptoplanner/images/ms-icon-310x310.png");
            toastImageElements[0].setAttribute("alt", "graphic");
            var toast = new notifications.ToastNotification(toastXml);
            var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
            toastNotifier.show(toast);
          }
          if (speechRecognitionResult.rulePath[0] === "showNote") {
            //$('body').append("<br>showNote rule: " + speechRecognitionResult.rulePath[0]);
            //$('body').append("<br>showNote note from Cortana: " + speechRecognitionResult.text);
          }

        }
      });

    }
});
