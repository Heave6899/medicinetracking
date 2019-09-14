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
    console.log(datestr);
    App.contracts.Medicine.deployed().then(function(instance){
      return instance.addMedicine(namestr, expdatestr, datestr, {from: App.account, gas: 2000000 });
    }).catch(function(err){
      console.error(err);
    });
  }
  },
  searchMed: function(){
    var instance;
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(_instance){
      instance =_instance;
      return instance.searchexpdate(search);
    }).then(function(medexpdate){
      $("#content").show();
      $("#name").html($('#searchbar').val());
      $("#expdate").html(medexpdate);
    }).catch(function(err){
      console.error(err);
    });
    return App.searchdate();
  },

  searchdate: function(){
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(instance){
      return instance.searchdate(search);
    }).then(function(meddate){
      $("#date").html(meddate);
    }).catch(function(err){
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
