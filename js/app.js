(function(){
  var CrimeApp = function(opts) {
    return new App(opts);
  }
  
  function App( opts ){
    this.crimes = 
      ['Stabbing',
        'Shooting',
        'Banana Theft',
        'Gazelle Feeding',
        'Car Racing',
        'Stripping',
        'Playing Classical Guitar',
        'Oversleeping'
      ];
    this.locations = 
    ['The Old Mill',
      'The Zoo',
      'The Waterfront',
      'The City Center',
      'The Badlands', 
      'Highway 1'
    ];
    
    this.getCrimes = function() {
      return this.crimes;
    }
    this.getLocations = function() {
      return this.locations;
    }
    
    this.buildWarningMessage = function(count) {
      var warningMsg = '';
      if(count < 4) {
        warningMsg = "Still pretty safe, really."
      }
      else if(count >= 4 && count < 8) {
        warningMsg = "I'd watch myself if I were you.<br />Don't go there after dark!"
      }
      else if(count >= 9) {
        warningMsg = "This place is extremely dangerous!<br />Stay the hell out of there if you value your life!"
      }
      return warningMsg;
    }
    
    this.crimeReport = function(crime){
      var counter=0,
          arr = [],
          report = '',
          msg = '';
      return function(number, time, location) {
        var self = new App();
        counter ++;
        msg = "<strong>Alert! There has been an incident!</strong><br />" +
              number + " " + crime + "(s) happened around " +
              time + ", <br />at " + location + '. <br />This has happened ' + 
              counter + ' times at this location.<br />' +
              self.buildWarningMessage(counter);
        return msg;
      }
    }
  }
  
  
  if(!window.CrimeApp){
    window.CrimeApp = CrimeApp;
  }
})();