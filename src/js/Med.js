App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    init: function(){
      return App.initWeb3();
    },
    
    initWeb3: function(){
      if(typeof web3 == 'undefined'){
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
      }
      return App.initContract();
    },
  
    initContract: function() {
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
          $("#accountAddressclient").html("Your Account: " + account);
          $("#accountAddress6").html("Your Account: " + account);
          $("#accountAddress7").html("Your Account: " + account);
        }
      });
      $.getJSON("Medicine.json", function(medicine) {
        App.contracts.Medicine = TruffleContract(medicine);
        App.contracts.Medicine.setProvider(App.web3Provider);
      });
    },
    urlidentifer: function(name){
        url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
   // medname: urlidentifer('mn'),
    meddetails: function(){
        var instance;
        var _name = App.urlidentifer("mn");
        $('#namemed').append(_name);
        App.contracts.Medicine.deployed().then(function(_instance){
        instance =_instance;
        return instance.count();
        }).then(function(count){
          $("#meddets").html("");
          for(var i=0;i<=count;i++)
          { 
            instance.medicines(i).then(function(medicine){
              var name1 = medicine[2];
              var uidp = name1.split('-');
              var name = uidp[0];
              var desc = medicine[7];
              var medtemplate = "<tr><td>" +desc+ "</td></tr>"
              //console.log(name)
              if(_name == name){
                $("#meddets").append(medtemplate);
            }
            });
          }
        }).catch(function(err){
          console.error(err);
          });
      }
};
$(function() {
    $(window).load(function() {
      App.init();
      //App.meddetails();
    });
  });
  