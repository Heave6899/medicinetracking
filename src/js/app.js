ethereum.enable();
//var Web3EthAbi = require('web3-eth-abi');
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  headers: {"Access-Control-Allow-Origin": true,
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With, remember-me"
          },
  //jsonFile = ".../package.json",
  //parsed= JSON.parse(fs.readFileSync(jsonFile)),
  //abi = parsed.abi,
  transactionParameters: {
    nonce: '0x00', // ignored by MetaMask
    gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
    gasLimit: '0x2710',  // customizable by user during MetaMask confirmation.
    //to: '0xD04847C87a72aeCf7BaCbF7eE26f7F6EedDCD2f8', // Required except during contract publications.
    from: web3.eth.accounts[0], // must match user's active address.
    value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    //data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    //chainId: 3 // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  },
  
  contractAddress: '0xD04847C87a72aeCf7BaCbF7eE26f7F6EedDCD2f8',
  //contract: '',
  init: function(){
    $("#content").hide();
    $("#content-cli").hide();
    return App.initWeb3();
  },

  initWeb3: function(){
    if(typeof web3 == 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/96fa1c881e2d49ad8673a053d2cd9f2c');
      web3 = new Web3(App.web3Provider);
      console.log("connected");
    }
    return App.initContract();
  },

  initContract: function() {
   //web3.eth.getAccounts().then(function(e){ console.log(e)});
   ethereum.enable()
   .then(function (accounts) {
     // You now have an array of accounts!
     // Currently only ever one:
     console.log(accounts[0]);
     App.account=accounts[0];
     $("#accountAddress").html("Your Account: " + App.account);
        $("#accountAddressclient").html("Your Account: " + App.account);
        $("#accountAddress6").html("Your Account: " + App.account);
        $("#accountAddress7").html("Your Account: " + App.account);
     // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
   })
   .catch(function (reason) {
     // Handle error. Likely the user rejected the login:
     console.log(reason === "User rejected provider access")
   });
   //App.contracts = web3.eth.Contract(contractABI,contractAddress);
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        
      }
    });
    $.getJSON("Medicine.json", function(medicine) {
      App.contracts.Medicine = TruffleContract(medicine);
      App.contracts.Medicine.setProvider(App.web3Provider);
      console.log(App.web3Provider);
    });
  },
  medList:function(){
    var instance;
    $("#medlist").html("");
    $("#medbatch").html("");
    App.contracts.Medicine.deployed().then(function(_instance){
      instance=_instance;
      return instance.count();
    }).then(function(count){
      for(var i=1;i<=count;i++){
        instance.medicines(i).then(function(medicine){
          var name = medicine[2];
          var nameparts = name.split('-');
          var batch = nameparts[1];
          var namep = nameparts[0];
          var ship = medicine[5];
          console.log(name,namep,batch,ship);
          var medicinelist = "<option value=" + namep + ">" + namep + "</option>";
          var batchlist = "<option value=" + batch + ">" + batch + "</option>";
          if(ship!='Yes'){
          $("#medlist").append(medicinelist);
          $("#medbatch").append(batchlist);}
        });
      }
    }).catch(function(err){
      console.error(err);
    });

    App.contracts.Medicine.deployed().then(function(_instance){
      instance = _instance;
      return instance.countcomp();
    }).then(function(count){
      $("#shipcomplist").html("");
      for(var i=1;i<=count;i++){
        instance.shipcomps(i).then(function(company){
          var namec = company[1];
          console.log(namec);
          var complist = "<option value=" + namec + ">" + namec + "</option>";
          $("#shipcomplist").append(complist);
        });
      }
    }).catch(function(err){
      console.error(err);
    });
  },
  medListcli:function(){
    var instance;
    $("#labelnoscli").html("No.of Units");
    $("medbatchcli").html("");
    $("#medlistcli").html("");
    App.contracts.Medicine.deployed().then(function(_instance){
      instance=_instance;
      return instance.count();
    }).then(function(count){
      for(var i=1;i<=count;i++){
        instance.countnos(i).then(function(medicine){
          var name = medicine[0];
          var nameparts = name.split('-');
          var batch = nameparts[1];
          var namep = nameparts[0];
          var ship = medicine[5];
          var nos = parseInt(medicine[1]);
          var man = medicine[1].split('-');
          var mfg = man[1];
          var min = nos;
          var nostemplate = "<br>Max ( " + nos + " units available)"; 
          //console.log(name,namep,batch,ship);
          var medicinelist = "<option value=" + namep + ">" + namep + "</option>";
          var batchlist = "<option value=" + batch + ">" + batch + "</option>";
          if(nos>0){
          min=nos;
          $("#medlistcli").append(medicinelist);
          $("#medbatchcli").append(batchlist);        
        }
        });
      }
    }).catch(function(err){
      console.error(err);
    });
  },

  addMed:function(){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
        $("#accountAddressclient").html("Your Account: " + account);
    
      }
    });
    var name = $('#medname').val();
    var mfg1 = $('#manufacturer').val();
    var date = $('#meddate').val();
    var expdate = $('#medexpdate').val();
    var uid = $('#meduid').val();
    var nos = $('#nosmfg').val();
    var name = name + "-" + uid;
    var mfg = mfg1 + "-M";
    console.log(name+" "+date);
    if(date>expdate){
      alert("Invalid Expiry Date, cannot be less than manufacturing date");
      $("#formadd").trigger("reset");
    }
    else{
    var namestr = name.toString();
    var datestr = date.toString();
    var nosstr = nos.toString();
    var expdatestr = expdate.toString();
    $("#formadd").trigger("reset");
    console.log(datestr);
    //var getData = App.contracts.Medicine.addMedicine.getData(mfg,namestr, expdatestr, datestr,nosstr,nosstr);
    App.contracts.Medicine.deployed().then(function(instance){
      //return instance.addMedicine(mfg,namestr, expdatestr, datestr,nosstr,nosstr, {transactionParameters, to: 'Medicine.addMedicine(string,string,string,string,string,string) 0xD04847C87a72aeCf7BaCbF7eE26f7F6EedDCD2f8'});
      //web3.eth.sendTransaction({to:'Medicine.addMedicine(string,string,string,string,string,string) 0xD04847C87a72aeCf7BaCbF7eE26f7F6EedDCD2f8', from: App.account, data: getData});
      //var getData = instance.addMedicine(mfg,namestr, expdatestr, datestr,nosstr,nosstr);
      var getData = web3.eth.abi.encodeParameters(['uint',mfg],['uint',namestr],['uint'.expdatestr],['uint',datestr],['uint',nosstr],['uint',nosstr]);
      //instance.addMedicine(mfg,namestr, expdatestr, datestr,nosstr,nosstr).send({from: App.account,gas:2500000});
      web3.eth.sendTransaction({from: App.account, gas: 25000000, data: getData});
    }).catch(function(err){
      console.error(err);
    });
  }
  },

  addClient:function(){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddressclient").html("Your Account: " + account);
      }
    });
    
    var name = $('#medlistcli option:selected').val();
    var mfg1 = $('#client').val();
    var date = $('#meddatec').val();
    var expdate = $('#medexpdatec').val();
    var uid = $('#medbatchcli option:selected').val();
    var name = name + "-" + uid;
    var mfg = mfg1 + "-C";
    var nos = parseInt($('#noscli').val());
    console.log(nos);
    var availablenos = parseInt($("#maxcli").text());
    nosleft = availablenos - nos;
    console.log(nos);
    if(date>expdate){
      alert("Invalid Expiry Date, cannot be less than manufacturing date");
      $("#formaddc").trigger("reset");
    }
    else{
    var namestr = name.toString();
    var datestr = date.toString();
    var nosleftstr = nosleft.toString();
    var nosstr = nos.toString();
    var nosleftstr = nosleft.toString();
    var expdatestr = expdate.toString();
    $("#formaddc").trigger("reset");
    App.contracts.Medicine.deployed().then(function(instance){
      ethereum.enable();
      //return instance.addMedicine(mfg,namestr, expdatestr, datestr,nosleftstr, nosstr, {from: App.account, gas: 2500000 });
      //return instance.addMedicine(mfg,namestr, expdatestr, datestr,nosleftstr,nosstr).send({from: App.account,gas:2500000});
      App.contracts.addMedicine(mfg,namestr, expdatestr, datestr,nosleftstr,nosstr).send({from: App.account,gas:2500000});
    }).catch(function(err){
      console.error(err);
    });
  }
  },
  
  addShipcomp:function(){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddressclient").html("Your Account: " + account);
      }
    });
    var name = $('#namecompany').val();
    var contact = $('#contact').val();
    var tempcontrol = $('#tempcontrolshipmentcompany').val();
    var days = $('#days').val();
    var days = days.toString();
    contact = contact.toString();
    console.log(name,contact,tempcontrol,days);
    App.contracts.Medicine.deployed().then(function(instance){
        $("#formshipcomp").trigger("reset");
        alert("Transaction Success");
        return instance.addShipcomp(name,contact,tempcontrol,days, {from: App.account, gas: 2500000 });
        }).catch(function(err){
        console.error(err);
        });
  },

  addShipment:function(){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddressclient").html("Your Account: " + account);
      }
    });
    var namecomp = $('#shipcomplist').val();
    var medicine = $('#medlist').val();
    var batch = $('#medbatch').val();
    var tempcontrol = $('#tempcontrols').val();
    var datesend = $('#datesend').val();
    datesend = datesend.toString();
    var dateexpected = $('#dateexp').val();
    dateexpected = dateexpected.toString();
    medicine = medicine+"-"+batch;
    nos = $('#mednos').val();
    console.log(namecomp,medicine,batch,tempcontrols,datesend,dateexpected);
    App.contracts.Medicine.deployed().then(function(instance){
        $("#formshipment").trigger("reset");
        alert("Transaction Success");
        return instance.addShipment(namecomp,medicine,tempcontrol,datesend,dateexpected,nos, {from: App.account, gas: 2500000 });
        }).catch(function(err){
        console.error(err);
        });
  },

  searchmfg: function(){
    var instance;
    var med = $("medicines");
    med.empty();
    var search = $('#searchbar').val();
    App.contracts.Medicine.deployed().then(function(_instance){
    instance =_instance;
    return instance.count();
    }).then(function(count){
      $("#medicinedetails").html("");
      var max;
      for(var i=0;i<=count;i++)
      { 
        instance.medicines(i).then(function(medicine){
          var mfg = medicine[1];
          var name1 = medicine[2];
          var expdate = medicine[3];
          var date = medicine[4];
          var shipped = medicine[5];
          var uidp = name1.split('-');
          var uid = uidp[1];
          var name = uidp[0];
          var mp = mfg.split('-');
          var m = mp[1];
          var mfg = mp[0];
          var today = new Date();
          var parts = expdate.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
          var date = medicine[4];
          var expiry = "No";
          var nos = medicine[6];
          if(mydate<today){expiry="Yes";}
          var medtemplate = "<tr><th>" +uid+ "</th><td>"+ mfg + "</td><td>" + name + "</td><td>" + date + "</td><td>" + expdate + "</td><td>" + expiry + "</td><td>"+ shipped +"</td><td>"+ nos +"</tr>"
          //console.log(name);
          if(search == name){
            $("#content").show();
            if(m!='C'){
            $("#medicinedetails").append(medtemplate);
            max = max - nos;
            }
        }
        });
      }
    }).catch(function(err){
      console.error(err);
      });
  },

  searchclient: function(){
    var instance;
    var med = $("medicines");
    med.empty();
    var search = $('#searchbarcli').val();
    App.contracts.Medicine.deployed().then(function(_instance){
    instance =_instance;
    return instance.count();
    }).then(function(count){
      $("#medicinedetailsc").html("");
      for(var i=0;i<=count;i++)
      {
        instance.medicines(i).then(function(medicine){
          var mfg = medicine[1];
          var name1 = medicine[2];
          var expdate = medicine[3];
          var date = medicine[4];
          var uidp = name1.split('-');
          var uid = uidp[1];
          var name = uidp[0];
          var mp = mfg.split('-');
          var m = mp[1];
          var mfg = mp[0];
          var today = new Date();
          var parts = expdate.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
          var date = medicine[4];
          var expiry = "No";
          var nos = medicine[6]
          if(mydate<today){expiry="Yes";}
          var medtemplate = "<tr><th>" +uid+ "</th><td>"+ mfg + "</td><td>" + name + "</td><td>" + date + "</td><td>" + expdate + "</td><td>" + expiry + "</td><td>"+ nos+"</td></tr>"
          //console.log(nos);
          if(search == name){
            $("#content-cli").show();
            if(m!='M'){
            $("#medicinedetailsc").append(medtemplate);
            }
        }
        });
      }
    }).catch(function(err){
      console.error(err);
      });
 //   App.contracts.Medicine.deployed().then(function(_instance){
   //   instance=_instance;
     // return instance.count();
 //   }).then(function(count){
   //   for(var i = 0;i<=count;i++)
    //  {
   //     instance.countnos(i).then(function(medicine){
   //       var given = medicine[2];
   //       var template = "<td>"+ given +"</td></tr>"; 
   //       var namep = medicine[0].split('-');
   //       var name = namep[0];
   //       var batch = namep[1];
   //       if(search == name){
   //         $("#medicinedetailsc").append(template);
   //       }
   //     });
   //   }
   // }).catch(function(err){
   //     console.error(err);
   //     });
  },
  batchchangecli: function(){
    var instance;
    var name = $('#medlistcli option:selected').val();
    $('#medbatchcli').html('');
    $('#labelnoscli').html('No. of Units');
    $('#maxcli').html('');
    App.contracts.Medicine.deployed().then(function(_instance){
      instance = _instance;
      return instance.count();
    }).then(function(count){
      var min;
      for(var i =0;i<=count;i++)
      {
        instance.countnos(i).then(function(medicine){
          var medname = medicine[0];
          var mednamep = medname.split('-');
          var medbatch = mednamep[1];
          var nos = medicine[1];
          medname = mednamep[0];
          var nostemplate = "<br>Max ( " + nos + " units available)"; 
          var medicinebatch = "<option value=" + medbatch + ">" + medbatch + "</option>";
          if(medname == name){
            $('#medbatchcli').append(medicinebatch);
            $('#labelnoscli').append(nostemplate);
            $('#maxcli').html(nos);
            //alert(parseInt($('#maxcli').html()));
          } 
        })
      }
    })
  },

  batchchange: function(){
    var instance;
    var name = $('#medlist option:selected').val();
    $('#medbatch').html('');
    $('#maxcli').html('');
    $('#labelnos').html('No. of Units');
    App.contracts.Medicine.deployed().then(function(_instance){
      instance = _instance;
      return instance.count();
    }).then(function(count){
      for(var i =0;i<=count;i++)
      {
        instance.countnos(i).then(function(medicine){
          var medname = medicine[0];
          var mednamep = medname.split('-');
          var medbatch = mednamep[1];
          var nos = medicine[1];
          medname = mednamep[0];
          var nostemplate = "<br>Max ( " + nos + " units available)"; 
          var medicinebatch = "<option value=" + medbatch + ">" + medbatch + "</option>";
          if(medname == name){
            $('#medbatch').append(medicinebatch);
            $('#labelnos').append(nostemplate);
            $('#maxcli').html(nos);
          } 
        })
      }
    })
  }
};



$(function() {
  $(window).load(function() {
    App.init();
    ethereum.autoRefreshOnNetworkChange = false;
    ethereum.enable();
    //$("#search").hide();
    //$("#searchclient").hide();
    //$("#formm").hide();
    //$("#formc").hide();
    //$("#formshipcomp").hide();
    //$("#formshipment").hide();
  });
});
ethereum.on('accountsChanged', function (accounts) {
//location.reload();
});
