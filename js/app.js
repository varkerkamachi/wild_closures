(function(){
  var CrimeApp = function(opts) {
    return new App(opts);
  }
  
  function App( opts ){
    App.prototype.crimes = 
      ['Stabbing',
        'Shooting',
        'Banana Theft',
        'Gazelle Feeding',
        'Car Racing',
        'Stripping',
        'Playing Classical Guitar',
        'Oversleeping'
      ];
    App.prototype.locations = 
    ['The Old Mill',
      'The Zoo',
      'The Waterfront',
      'The City Center',
      'The Badlands', 
      'Highway 1'
    ];
    App.prototype.defaults = {
      mapEl: '',
      crime: '',
      loc: '',
      selectedLocation: '',
      selectedCrime: '',
      report: '',
      modalCount: 0,
      utils: new Utils(),
      times: ['am', 'pm']
    };
    
    /*
      ====> update defaults called after document has loaded
    */
    App.prototype.updateDefaultConfig = function() {
      App.prototype.defaults.mapEl                = document.getElementById('crime_map');
      App.prototype.defaults.loc                  = document.getElementById('location_selector');
      App.prototype.defaults.selectedLocation     = document.getElementById('location_selector').value;
      App.prototype.defaults.crime                = document.getElementById('crime_selector');
      App.prototype.defaults.selectedCrime        = document.getElementById('crime_selector').value;
    };
    
    /*
      ====> adds locations onto map
    */    
    App.prototype.buildMapLocations = function(locations) {
      var locElm,
          locElmInner,
          delay = 15,
          mapLocations=[];
      for(var i=0, max=locations.length; i<max; i++){
        locElm = document.createElement('div');
        locElmInner = document.createElement('span');
        locElm.setAttribute('class', 'map_locations ' + this.getLocationClass(locations[i]));
        locElmInner.innerText = locations[i];
        locElm.appendChild(locElmInner);
        mapLocations.push(locElm);
      }
      
      for(var j=0, max=mapLocations.length; j<max; j++){
        // mapLocations[j].setAttribute('style', 'opacity: 0');
        //plot on map
        setTimeout(
          (function(j){
            return function(){
              App.prototype.defaults.mapEl.appendChild(j);
              setTimeout(
                (function(){
                  return j.setAttribute('style', 'opacity: 1');
                }), 100);
            }
        })(mapLocations[j]), delay);
        delay += (delay + delay);
      }
      App.prototype.configureMapLocations(mapLocations);
    };
    
    /*
      ====> adds event handlers onto map location icons and handles logic for plotting crime at correct location
    */
    App.prototype.configureMapLocations = function(mapLocations) {
      //check if 'loc' is set yet... if not exit
      if(typeof App.prototype.defaults.loc == 'undefined'){ return false; }
      
      var utils = App.prototype.defaults.utils;
      for(var i=0, len=mapLocations.length; i<len; i++) {
        mapLocations[i].addEventListener('click', function(e){
          //check if the max limit has been reached yet...
          utils.handleReportCount(utils.getReportCount());

          if((typeof App.prototype.defaults.report == null) || (App.prototype.defaults.selectedLocation == "---")){
            _handleIncorrectLocation(e, _buildLocationClass(App.prototype.defaults.selectedLocation));
            return false;
          }
          else if(App.prototype.defaults.selectedLocation.toUpperCase() != this.attributes['class'].value.split(" ")[1].replace(/_/g, ' ').toUpperCase()){
            _handleIncorrectLocation(e, _buildLocationClass(App.prototype.defaults.selectedLocation));
            return false;
          }
          else{
            var num = Math.floor((Math.random() * 6)+1),
                hr = Math.floor((Math.random() * 11)+1),
                ampm = App.prototype.defaults.times[Math.floor((Math.random() * 1)+1)],
                reportMsg = App.prototype.crimeReport(num, hr + ampm, App.prototype.defaults.selectedLocation);
                //create popup
                App.prototype.buildPopup(e, reportMsg);
            }
        });
      }
    };

    /*
      ====> builds popup modals and appends them to map
    */
    App.prototype.buildPopup = function(e, msg) {
      var modal = document.createElement('div'),
          utils = App.prototype.defaults.utils,
          crime = app.getCurrentCrime(app);//document.getElementById('crime_selector');
      modal.setAttribute('class', 'crime_modal');
      modal.style['z-index'] = this.defaults.zval;
      modal.setAttribute('id', 'crime_modal' + this.defaults.modalCount + '');
      var zidx = window.getComputedStyle(modal);
      
      modal.addEventListener('click', function(e){ e.stopPropagation();});
      
      var tip = document.createElement('div');
      tip.setAttribute('class', 'pointer');
      
      var left_col = document.createElement('div');
      left_col.setAttribute('class', 'col');
      
      var modal_img = document.createElement('div');
      modal_img.setAttribute('class', 'crime_icon ' + crime.toLowerCase().replace(/\s/g, '-') + '');
      
      var right_col = document.createElement('div');
      right_col.setAttribute('class', 'col');
      
      var closer = document.createElement('div');
      closer.setAttribute('class', 'close_button');
      closer.addEventListener('click', function(e){ return App.prototype.defaults.utils.closePopper(e, modal.id);});
      
      var closer_text = document.createElement('span');
      closer_text.innerHTML='close';
      
      var text = document.createElement('p');
      text.innerHTML=msg;
      
      closer.appendChild(closer_text);
      left_col.appendChild(modal_img);
      right_col.appendChild(text);
      modal.appendChild(left_col);
      modal.appendChild(right_col);
      modal.appendChild(closer);
      modal.appendChild(tip);
      
      utils.resetCount('reportCount', 1);//this.defaults.reportCount++;
      this.defaults.zval++;
      
      var xpos = e.pageX - this.defaults.mapEl.offsetLeft;
      var ypos = e.pageY - this.defaults.mapEl.offsetTop;
      modal.style.left = (xpos-xpos - 110) + 'px';
      modal.style.top = (ypos-ypos - 135) + 'px';
      e.target.appendChild(modal);
      utils.resetCount('modalCount', 1);
    };
    App.prototype.getCrimes = function() {
      return this.crimes;
    };
    App.prototype.getCurrentCrime = function() {
      return App.prototype.defaults.selectedCrime;
    };
    App.prototype.getLocations = function() {
      return this.locations;
    };
    App.prototype.getLocationClass = function( location ){
      return _buildLocationClass(location);
    };
    
    /*
      ====> handles case where user tries to plot a crime at an incorrect location
    */
    _handleIncorrectLocation = function(e, locationClass) {
      e.target.setAttribute('class', e.target.getAttribute('class') + ' location_error');
      setTimeout(function(){
        e.target.setAttribute('class', e.target.getAttribute('class').replace(/\slocation_error/, ''));
      }, 575);
      return false;
    };

    /*
      ====> formats name of location for compound css declaration
    */
    _buildLocationClass = function( location ) {
      if (typeof location == "undefined" || location.length < 1 || location.value == "---") {
        return "";
      }
      else {
        return location.toLowerCase().replace(/\s/g, '_');
      }
    };

    /*
      ====> adds listeners onto the crime select menu - reset it and hide instruction text again
    */
    App.prototype.configureCrimeSelect = function() {
      if(typeof App.prototype.defaults.crime == null){ return false; }
      var utils = App.prototype.defaults.utils;
      
      App.prototype.defaults.crime.addEventListener('change', function(e){
        if(this.value != "---"){
          App.prototype.defaults.loc.style.display = "block";
          App.prototype.defaults.selectedCrime = this.value;
        }
        else{
          App.prototype.defaults.loc.value = "---";
          App.prototype.defaults.loc.style.display = "none";
          utils.removeDOMNode(App.prototype.defaults.crime.parentNode, 'user_instructions');
        }
      });
    };

    /*
      ====> adds listeners onto the location select menu
    */
    App.prototype.configureLocationSelect = function(opts) {
      if(typeof App.prototype.defaults.loc == null){ return false; }
      var utils = App.prototype.defaults.utils;

      App.prototype.defaults.loc.addEventListener('change', function(){
        if(this.value != "---"){
          var options = {
            'idKey': 'user_instructions',
            'classKeys': 'instructions',
            'styleKeys': 'display:block',
            'dataSubject': 'instructions',
            'innerText': opts.innerText
          };
          utils.insertDOMNode(this.parentNode, 'p', options);
          App.prototype.defaults.report = App.prototype.crimeReport(App.prototype.getCurrentCrime());
          App.prototype.defaults.selectedLocation = this.value;
        }
      });
    };

    /*
      ====> configurable message for modal based on count of crime occurrences
    */
    App.prototype.buildWarningMessage = function(count) {
      var warningMsg = '';
      if(count < 4) {
        warningMsg = "Still pretty safe, really."
      }
      else if(count > 3 && count <= 7) {
        warningMsg = "I'd watch myself if I were you.<br />Don't go there after dark!"
      }
      else if(count > 7) {
        warningMsg = "This place is extremely dangerous!<br />Stay the hell out of there if you value your life!"
      }
      return warningMsg;
    };
    
    App.prototype.crimeReport = function(crime){
      var counter=0,
          arr = [],
          report = '',
          msg = '';
      return function(number, time, location) {
        msg = "<strong>Alert! There has been an incident!</strong><br />" +
              number + " " + App.prototype.getCurrentCrime() + "(s) happened around " +
              time + ", <br />at " + location + '. <br />This has happened ' + 
              counter + ' times at this location.<br />' +
              App.prototype.buildWarningMessage(counter);
        counter ++;
        return msg;
      }
    }();
  }

  if(!window.CrimeApp){
    window.CrimeApp = CrimeApp;
  }
})();