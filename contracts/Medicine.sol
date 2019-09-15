pragma solidity ^0.5.0;


contract Medicine {
  //string h; string date; uint count = 0;
  struct Medicines {
        uint id;
        string mfg;
        string name;
        string expdate;
        string date;
    }
  mapping(uint => Medicines) public medicines;
  //mapping(address=>bool) public medicalorg;
  uint public count;
  function addMedicine(string memory _mfg,string memory _name, string memory _expdate,string memory _date) public {
        count ++;
        medicines[count] = Medicines(count,_mfg, _name, _expdate, _date);
    }
    constructor () public {
        addMedicine("Manufacturer 1","Medicine 1","2019-02-28","2017-03-20");
        addMedicine("Manufacturer 2","Medicine 2","2020-05-04","2016-02-20");
    }
  /*function set(string memory _h,string memory _date) public{
    h = _h;
    date = _date;
  }*/
  function getname(uint i) public view returns(string memory){
    return medicines[i].name;
  }
  function getdate(uint i) public view returns(string memory){
    return medicines[i].date;
  }
  function bytes32ToString (bytes32 data) public pure returns (string memory) {
    bytes memory bytesString = new bytes(32);
    for (uint j = 0;j < 32;j++) {
        byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[j] = char;
        }
    }
    return string(bytesString);
}
  function getexpdate(uint i) public view returns(string memory){
    return medicines[i].expdate;
  }
  function searchexpdate(string memory _name) public view returns(string memory){
    for(uint i = 1; i <= count; i++)
    {
      if(keccak256(abi.encodePacked((medicines[i].name))) == keccak256(abi.encodePacked((_name)))){
        return medicines[i].expdate;

      }
    }
  }
  function searchdate(string memory _name) public view returns(string memory){
    for(uint i = 1; i <= count; i++)
    {
      if(keccak256(abi.encodePacked((medicines[i].name))) == keccak256(abi.encodePacked((_name)))){
        return medicines[i].date;
      }
    }
  }
}
