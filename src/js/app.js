App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function(){
    $("#content").hide();
    return App.initWeb3();
  },

  initWeb3: function(){
    if(typeof web3 == 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      //web3.eth.getAccounts(console.log);
    }
    return App.initContract();
  },

  initContract: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    $.getJSON("Medicine.json", function(medicine) {
      App.contracts.Medicine = TruffleContract(medicine);
      App.contracts.Medicine.setProvider(App.web3Provider);
    });
  },
  addMed:function(){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    var name = $('#medname').val();
    var mfg = $('#manufacturer').val();
    var date = $('#meddate').val();
    var expdate = $('#medexpdate').val();
    //console.log(name+" "+date);
    if(date>expdate){
      alert("Invalid Expiry Date, cannot be less than manufacturing date");
      $("#formadd").trigger("reset");
    }
    else{
    var namestr = name.toString();
    var datestr = date.toString();
    var expdatestr = expdate.toString();
    $("#formadd").trigger("reset");
    console.log(datestr);
    App.contracts.Medicine.deployed().then(function(instance){
      return instance.addMedicine(mfg,namestr, expdatestr, datestr, {from: App.account, gas: 2000000 });
    }).catch(function(err){
      console.error(err);
    });
  }
  },
  
  search: function(){
    var instance;
    var med = $("medicines");
    med.empty();
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(_instance){
    instance =_instance;
    return instance.count();
    }).then(function(count){
      $("#medicinedetails").html("");
      for(var i=0;i<=count;i++)
      {
        instance.medicines(i).then(function(medicine){
          var mfg = medicine[1];
          var name = medicine[2];
          var expdate = medicine[3];
          var today = new Date();
          var parts = expdate.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
          var date = medicine[4];
          var expiry = "No";
          if(mydate<today){expiry="Yes";}
          var medtemplate = "<tr><th>" + mfg + "</th><td>" + name + "</td><td>" + date + "</td><td>" + expdate + "</td><td>" + expiry + "</td></tr>"
          console.log(name);
          if(search == name){
            $("#content").show();
            $("#medicinedetails").append(medtemplate);
          }
        });
      }
    })
  }
};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
