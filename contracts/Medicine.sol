pragma solidity ^0.5.0;


contract Medicine {
  //string h; string date; uint count = 0;
  struct Medicines {
        uint id;
        string name;
        string expdate;
        string date;
    }
  mapping(uint => Medicines) public medicines;
  uint public count;
  function addCandidate (string memory _name, string memory _expdate,string memory _date) public {
        count ++;
        medicines[count] = Medicines(count, _name, _expdate, _date);
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
  function getexpdate(uint i) public view returns(string memory){
    return medicines[i].expdate;
  }
  function search(string memory _name) public view returns(string memory){
    for(uint i = 1; i <= count; i++)
    {
      if(keccak256(abi.encodePacked((medicines[i].name))) == keccak256(abi.encodePacked((_name)))){
        return medicines[i].expdate;
      }
    }
  }
}
