/*

	CS331 Neural Computing Coursework JavaScript Code
	Joe Butler 1100422
	Neural Nets are of the form: [0,1,0,1,0,0,0,1,1]
	
*/

window.onload = function(e){

	//Confirmation of success in loading script
	console.log("Hopfield Environment Loaded");
	
	//Store of random initial states
	exampleNets = [[1, 1, 1, 0, 0, 1, 1, 0, 1], [1, 0, 0, 1, 0, 1, 0, 0, 1], [1, 1, 0, 0, 1, 0, 0, 0, 1], [0, 0, 0, 1, 0, 1, 0, 1, 1], [1, 0, 0, 1, 0, 0, 0, 0, 0], [1, 1, 0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 0, 0, 0, 1, 1, 1], [1, 1, 0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 1, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 0, 1, 0, 0, 0, 1], [0, 1, 0, 1, 1, 1, 0, 1, 1], [1, 0, 1, 1, 1, 1, 1, 1, 0], [1, 1, 0, 0, 1, 0, 1, 0, 0], [1, 0, 0, 1, 0, 1, 0, 0, 0], [1, 0, 0, 1, 1, 0, 0, 0, 1], [0, 0, 1, 0, 0, 0, 1, 0, 1], [1, 0, 0, 1, 1, 0, 1, 0, 1], [0, 0, 0, 0, 1, 0, 1, 1, 1], [1, 0, 0, 1, 1, 0, 0, 1, 0]];

	//Store of all possible initial states
	exhaustiveNets = generateAllBinaryConfigurations();
	
	//Generate 2 weight matrices with inhibition constants 0.5 and 1 respectively
	weightMatrices = {"0.5":generateWeightMatrix(0.5), "1":generateWeightMatrix(1)};

}

testFinalStateAccuracy = function(randOrSeq, array, iterations, simulations, inhibitionConstant){

	//Create a store of the stats to output
	var stats = {};

	//For however many simulations have been specified
	for(var s = 0; s<simulations; s++){
	
		//Run an 'n' iteration search
		var finalstate = search(randOrSeq, array, iterations, isNewArrayLessThanOrEqualToOldArray, inhibitionConstant);
	
		//Update the statistics with the final state
		if(stats[binaryArrayToValue(finalstate)]==undefined){
			stats[binaryArrayToValue(finalstate)] = 0;
		}
		stats[binaryArrayToValue(finalstate)]++;
	}
	
	//Output the overall results to the console
	console.log("S("+binaryArrayToValue(array)+") finished on the following states the following times after "+iterations+" iterations:");
	var build = "";
	for(var s in stats){
		build = build + "S("+s+") : " + stats[s] +", \n";
	}
	console.log(build);
}

largeScaleRandomSearchLE = function(iterations, inhibitionConstant){
//Search all 9 bit binary states for respective final states given the parameters:
	//Random asynchronous movement
	//decision rule move if <=

	console.log("Random Search w = "+inhibitionConstant+" i = "+iterations+" threshold on: E<=E");

	//Store the statistics for each result
	var statistics = {};
	
	//For each binary state exhaustively
	for(var i=0; i<exhaustiveNets.length; i++){
	
		//Search for its final state according to the given rules
		var rSearch = search("r", exhaustiveNets[i], iterations, isNewArrayLessThanOrEqualToOldArray, inhibitionConstant);
		console.log("S("+binaryArrayToValue(exhaustiveNets[i])+")=["+exhaustiveNets[i]+"] E="+calculateEnergyForState(exhaustiveNets[i], inhibitionConstant)+" -> S("+binaryArrayToValue(rSearch)+")=["+rSearch+"] E="+calculateEnergyForState(rSearch, inhibitionConstant))
		
		//If a statistics container for the resulting energy does not exist
		if(statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]==undefined){
		
			//Create it and set it to 0
			statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]=0;
		}

		//Increment it either way
		statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]++;
	}
	
	//Build a string to print out the results
	var build = "";
	
	for(var s in statistics){
		build = build + "S"+ s +":"+statistics[s]+", ";
	}
	
	//Print the Statistics
	console.log(build.substring(0,build.length-2));
}

largeScaleRandomSearchL = function(iterations, inhibitionConstant){
//Search all 9 bit binary states for respective final states given the parameters:
	//Random asynchronous movement
	//decision rule move if <

	console.log("Random Search w = "+inhibitionConstant+" i = "+iterations+" threshold on: E<E");
	
	//Store the statistics for each result
	var statistics = {};
	
	//For each binary state exhaustively
	for(var i=0; i<exhaustiveNets.length; i++){
	
		//Seach for its final state according to the given rules
		var rSearch = search("r", exhaustiveNets[i], iterations, isNewArrayLessThanOldArray, inhibitionConstant);
		console.log("S("+binaryArrayToValue(exhaustiveNets[i])+")=["+exhaustiveNets[i]+"] E="+calculateEnergyForState(exhaustiveNets[i], inhibitionConstant)+" -> S("+binaryArrayToValue(rSearch)+")=["+rSearch+"] E="+calculateEnergyForState(rSearch, inhibitionConstant))
		
		//If a statistics container for the resulting energy does not exist
		if(statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]==undefined){
		
			//Create it and set it to 0
			statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]=0;
		}

		//Increment it either way
		statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]++;
	}
	
	//Build a string to print out the results
	var build = "";
	
	for(var s in statistics){
		build = build + "S"+ s +":"+statistics[s]+", ";
	}
	
	//Print the Statistics
	console.log(build.substring(0,build.length-2));
}

largeScaleSequentialSearchLE = function(iterations, inhibitionConstant){
//Search all 9 bit binary states for respective final states given the parameters:
	//Sequential asynchronous movement
	//decision rule move if <=

	console.log("Sequential Search w = "+inhibitionConstant+" i = "+iterations+" threshold on: E<=E");
	
	//Store the statistics for each result
	var statistics = {};	

	//For each binary state exhaustively
	for(var i=0; i<exhaustiveNets.length; i++){
	
		//Search for its final state according to the given rules
		var rSearch = search("s", exhaustiveNets[i], iterations, isNewArrayLessThanOrEqualToOldArray, inhibitionConstant);
		console.log("S("+binaryArrayToValue(exhaustiveNets[i])+")=["+exhaustiveNets[i]+"] E="+calculateEnergyForState(exhaustiveNets[i], inhibitionConstant)+" -> S("+binaryArrayToValue(rSearch)+")=["+rSearch+"] E="+calculateEnergyForState(rSearch, inhibitionConstant))
	
		//If a statistics container for the resulting energy does not exist
		if(statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]==undefined){
		
			//Create it and set it to 0
			statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]=0;
		}

		//Increment it either way
		statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]++;
	}
	
	//Build a string to print out the results
	var build = "";
	
	for(var s in statistics){
		build = build + "S"+ s +":"+statistics[s]+", ";
	}
	
	//Print the Statistics
	console.log(build.substring(0,build.length-2));
}

largeScaleSequentialSearchL = function(iterations, inhibitionConstant){
//Search all 9 bit binary states for respective final states given the parameters:
	//Sequential asynchronous movement
	//decision rule move if <

	console.log("Sequential Search w = "+inhibitionConstant+" i = "+iterations+" threshold on: E<E");
	
	//Store the statistics for each result
	var statistics = {};	
	
	//For each binary state exhaustively
	for(var i=0; i<exhaustiveNets.length; i++){
	
		//Search for its final state according to the given rules
		var rSearch = search("s", exhaustiveNets[i], iterations, isNewArrayLessThanOldArray, inhibitionConstant);
		console.log("S("+binaryArrayToValue(exhaustiveNets[i])+")=["+exhaustiveNets[i]+"] E="+calculateEnergyForState(exhaustiveNets[i], inhibitionConstant)+" -> S("+binaryArrayToValue(rSearch)+")=["+rSearch+"] E="+calculateEnergyForState(rSearch, inhibitionConstant))
	
		//If a statistics container for the resulting energy does not exist
		if(statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]==undefined){
		
			//Create it and set it to 0
			statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]=0;
		}

		//Increment it either way
		statistics[binaryArrayToValue(rSearch)+":E="+calculateEnergyForState(rSearch, inhibitionConstant)]++;
	}
	
	//Build a string to print out the results
	var build = "";
	
	for(var s in statistics){
		build = build + "S"+ s +":"+statistics[s]+", ";
	}
	
	//Print the Statistics
	console.log(build.substring(0,build.length-2));
}

determineLocalMinimalAreas = function(inhibitionConstant){

	var groups = [];

	//For each binary state exhaustively
	for(var i=0; i<exhaustiveNets.length; i++){
	
		//Recursively check if that state and its neighbours conform to the rules defining it to be an area of local minima.
		var isItLocalMinimalArea = recursiveFlatPit(exhaustiveNets[i], inhibitionConstant);
		
		if(isItLocalMinimalArea){
		
			groups.push(globalMinimalArea);
			globalMinimalArea = [];
		}
	}

	//Print the results
	console.log(groups.length+" minimal area group(s) found for w = "+inhibitionConstant)
	
	for(var i=0; i<groups.length; i++){
		var build = "Group "+i+" states: (";
		
		for(var j=0; j<groups[i].length; j++){
			build = build + groups[i][j] + ", ";
		}
		
		build = build.substring(0, build.length-2) + ")";
		console.log(build);
	}
	
}

recursiveFlatPit = function(array, inhibitionConstant, doneStateValues){

//console.log("Checking state S:"+binaryArrayToValue(array)+" : "+array+" E:"+calculateEnergyForState(array, inhibitionConstant))

	//If this call is from the outside, and not by recursion:
	if(doneStateValues==undefined){
	
		//create a store for the states that have been searched
		doneStateValues = [];
		
		//Erase a global store for the states that conform to the growing minimal area check
		globalMinimalArea = [];
	}

	//If the state's neighbours have a greater than or equal to energy value, then they are candidates for local minimal areas of energy
	if(allneighboursAreGreaterOrEqual(array, inhibitionConstant)){
		
		//Push the value of the current array into the done pile, to pass to the recursive call
		doneStateValues.push(binaryArrayToValue(array));
		
		//Push this value to the global store
		globalMinimalArea.push(binaryArrayToValue(array));
				
		//Generate the neighbours of the array
		var neighbours = getneighboursForState(array);

		for(var n=0; n<neighbours.length; n++){
		
			//If the neighbour is in the doneStateValues
			if(doneStateValues.indexOf(binaryArrayToValue(neighbours[n]))!=-1){
				
				//remove it from the neighbours array to be searched
				var removed = neighbours.splice(n, 1);
				
				//And go back an index
				n--;
			}
		}

		for(var n=0; n<neighbours.length; n++){
		
			//For each neighbour that is equal in energy, recursively check
			if(calculateEnergyForState(neighbours[n], inhibitionConstant)==calculateEnergyForState(array, inhibitionConstant)){
		
				//Make the recursive call
				var checkDeeper = recursiveFlatPit(neighbours[n], inhibitionConstant, doneStateValues);
				
				//If any state fails the acid test
				if(checkDeeper==false){
				
					//All fails
					return false;
				}
			}
		}
		
		//If all eligible states pass:
		return true;
	}
	else{
		//console.log("One neighbour was strictly less in energy");
		return false;
	}
}

printneighbourstats = function(array, inhibitionConstant){
	
	console.log("This = s("+binaryArrayToValue(array)+") = ["+array+"]: E="+calculateEnergyForState(array, inhibitionConstant));

	//Generate the states of the neighbours
	var neighbours = getneighboursForState(array);
	
	for(var i=0; i<neighbours.length; i++){
		//Print details for each neighbour
		console.log("n("+i+") = s("+binaryArrayToValue(neighbours[i])+") = ["+neighbours[i]+"]: E="+calculateEnergyForState(neighbours[i], inhibitionConstant));
	}
}

determineFixedPoints = function(){
//Prints out the fixed points for both inhibition constants over an exhaustive set of 9 bit binary states

	var fixedPointsWa = [];
	var fixedPointsWb = [];

	//Determine the fixed points for when w = 0.5
	for(var e in exhaustiveNets){
		if(!isThereBetterOrEqualneighbour(exhaustiveNets[e], "0.5")){
			console.log("Fixed Point for w = 0.5: State("+binaryArrayToValue(exhaustiveNets[e])+") = "+exhaustiveNets[e]+"; E="+calculateEnergyForState(exhaustiveNets[e], "0.5"));
			fixedPointsWa.push(exhaustiveNets[e]);
		}
	}
	
	console.log("");
	
	//Determine the fixed points for when w = 1
	for(var e in exhaustiveNets){
		if(!isThereBetterOrEqualneighbour(exhaustiveNets[e], "1")){
			console.log("Fixed Point for w = 1: State("+binaryArrayToValue(exhaustiveNets[e])+") = "+exhaustiveNets[e]+"; E="+calculateEnergyForState(exhaustiveNets[e], "1"));
			fixedPointsWb.push(exhaustiveNets[e]);
		}
	}
	
	return {"FPW0.5":fixedPointsWa ,"FPW1":fixedPointsWb};
}

search = function(type, array, iterations, decisionFunction, inhibitionConstant){
//Performs a state to state sequential/random search for a given array, number of iterations, decision function and an inhibition constant

	//Decide whether the search is sequential or random
	if(type=="r"){
		type = "Random";
		var decider = function(){return (Math.floor(Math.random()*100)%9)};
	}
	else{
		type = "Sequential"
		var decider = function(i){return (i%9)};
	}

	//Decision function should be either:
		//isNewArrayLessThanOrEqualToOldArray, or
		//isNewArrayLessThanOldArray
	
	//Declare the working array
	var newState = array;
	
	//Store the value of the binary sum of the array for identification purposes
	var newStateId = binaryArrayToValue(array);

	//Print initial status
	//console.log(type+"Search Start s("+newStateId+") ["+newState+"] E:"+calculateEnergyForState(newState, inhibitionConstant));
		
	for(var i=0; i<iterations; i++){
	
		//Store the new or unchanged state for the update call
		var newState = updateState(newState, decider(i), decisionFunction, inhibitionConstant);
	
		//Store the Id of the new state temporarily
		var tempId = binaryArrayToValue(newState);
		
		//Only if there is a change in state:
		if(tempId!=newStateId){
			//Print intermediate status
			//console.log(type+"Search Iteration "+i+": ["+newState+"] E:"+calculateEnergyForState(newState, inhibitionConstant));
		}
		
		//Update the Id to be that of the new state
		newStateId = tempId;
	}
	
	//Print final status
	//console.log("Finished "+iterations+" iterations: s("+newStateId+") ["+newState+"] E:"+calculateEnergyForState(newState, inhibitionConstant));
		
	//Return the final state
	return newState;
}

updateState = function(array, index, decisionFunction, inhibitionConstant){
//Return a new state depending on the index to update, the decision function, and the inhibitionConstant

	//Generate a new state with the specified index in the array bit-flipped
	var neighbour = flipBitForState(array, index);
	
	//If the bit-flipped state results in a strictly/non-strictly lower energy according to the decision function, either:
	if(decisionFunction(array, neighbour, inhibitionConstant)){
		return neighbour;
	}
	else{
		return array;
	}
}

isNewArrayLessThanOrEqualToOldArray = function(oldArray, newArray, inhibitionConstant){
//Returns true or false depending on whether the energy for the newArray is less than or equal to the energy for the old 

	//Calculate the current energy for the old array
	var oldEnergy = calculateEnergyForState(oldArray, inhibitionConstant);
	
	//Calculate the current energy for the new array
	var newEnergy = calculateEnergyForState(newArray, inhibitionConstant);
	
	if(newEnergy <= oldEnergy){
		return true;
	}
	else{
		return false;
	}
}

isNewArrayLessThanOldArray = function(oldArray, newArray, inhibitionConstant){
//Returns true or false depending on whether the energy for the newArray is strictly less than the energy for the old

	//Calculate the current energy for the old array
	var oldEnergy = calculateEnergyForState(oldArray, inhibitionConstant);
	
	//Calculate the current energy for the new array
	var newEnergy = calculateEnergyForState(newArray, inhibitionConstant);
	
	
	if(newEnergy < oldEnergy){
		return true;
	}
	else{
		return false;
	}
}

allneighboursAreGreaterOrEqual = function(array, inhibitionConstant){
//Returns true or false depending on whether or not there exists a strictly greater energy state within 1 bitflip of the current state

	//Generate the neighbours of the specified state
	var neighbours = getneighboursForState(array);
	
	for(var n in neighbours){

		//If there is a neighbour with a strictly lower energy,
		if(isNewArrayLessThanOldArray(array, neighbours[n], inhibitionConstant)){

			return false;
		}
	}
	
	//Else
	return true;
}

isThereBetterOrEqualneighbour = function(array, inhibitionConstant){
//Returns true or false depending on whether or not there exists a lower or equal energy state within 1 bitflip of the current state

	//Generate the neighbours of the specified state
	var neighbours = getneighboursForState(array);
	
	for(var n in neighbours){

		//If there is a neighbour with a lower or equal energy,
		if(isNewArrayLessThanOrEqualToOldArray(array, neighbours[n], inhibitionConstant)){

			return true;
		}
	}

	//If there is no neighbour with lower or equal energy
	return false;
}

isThereStrictlyBetterneighbour = function(array, inhibitionConstant){
//Returns true or false depending on whether or not there exists a strictly lower energy state within 1 bitflip of the current state

	//Generate the neighbours of the specified state
	var neighbours = getneighboursForState(array);
	
	for(var n in neighbours){

		//If there is a neighbour with a strictly lower energy,
		if(isNewArrayLessThanOldArray(array, neighbours[n], inhibitionConstant)){

			return true;
		}
	}

	//If there is no neighbour with strictly lower energy
	return false;
}

getneighboursForState = function(array){
//Returns an array of 9 states each 1 bit in each direction from the specified argument

	//Array to return
	var neighbours = [];
	
	for(var i=0; i<9; i++){

		//Copy the specified array 9 times, each time with one of the indices bit flipped, push the result into the array to return.
		neighbours.push(flipBitForState(array.slice(0), i));
	}
	
	return neighbours;
}

flipBitForState = function(array, index){
//Returns a copy of an array with a bit flipped for a specified index

	var newState = array.slice(0);

	if(newState[index]==1){
		newState[index] = 0;
		return newState;
	}
	else{
		newState[index] = 1;
		return newState;
	}
}

calculateEnergyForState = function(array, inhibitionConstant){
//Return the energy of a state from a binary array representing that state, and a given inhibition constant

	//Maintain a sum of energy
	var sum = 0;
		
	//For each pairs of neurons that are on: i.e. 1 add the weight between them
	for(var i=0; i<9; i++){
		for(var j=0; j<9; j++){
		
			//We don't need to consider pairs more than once
			if(i<j){
				if((array[i]==1)&&(array[j]==1)){
					
					try{
					
						//Minus the energy from the overall sum, so that we look for the minimum
						sum = sum - weightMatrices[inhibitionConstant][i][j];
						
					}catch(error){
						throw new Error("You forgot to specify an inhibitionConstant");
					}
				}
			}
		}
	}
	return sum;
}

generateWeightMatrix = function(inhibitionConstant){
//Generate a matrix to use with a given inhibition constant and return it.

	//Create an initial 2D array
	var weightMatrix = [
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0]
	];

	//Alter the weight matrix according the rules provided in the pdf
	for(var i=0; i<9; i++){
	
		for(var j=0; j<9; j++){
		
			if(i==j){
				weightMatrix[i][j] = 0;
			}
			else if(i==2 &&(j==5 || j==8)){
				weightMatrix[i][j] = 1;
			}
			else if(i==5 &&(j==2 || j==8)){
				weightMatrix[i][j] = 1;
			}
			else if(i==8 &&(j==2 || j==5)){
				weightMatrix[i][j] = 1;
			}
			else if(i==4 &&(j==5 || j==6)){
				weightMatrix[i][j] = 1;
			}
			else if(i==5 &&(j==4 || j==6)){
				weightMatrix[i][j] = 1;
			}
			else if(i==6 &&(j==5 || j==4)){
				weightMatrix[i][j] = 1;
			}
			else{
				weightMatrix[i][j] = inhibitionConstant * (-1);
			}
		}
	}
	return weightMatrix;
}

binaryArrayToValue = function(array){
//example call: binaryArrayToValue([0,0,0,0,0,0,1,0,1]); 
	//returns 5

	var sum = 0;

	for(var i=0; i<array.length; i++){
		
		switch(i){
			case 0:if(array[i]==1){sum+=256};break;
			case 1:if(array[i]==1){sum+=128};break;
			case 2:if(array[i]==1){sum+=64};break;
			case 3:if(array[i]==1){sum+=32};break;
			case 4:if(array[i]==1){sum+=16};break;
			case 5:if(array[i]==1){sum+=8};break;
			case 6:if(array[i]==1){sum+=4};break;
			case 7:if(array[i]==1){sum+=2};break;
			case 8:if(array[i]==1){sum+=1};break;
		}
	}
	
	return sum;
}

valueToBinaryArray = function(value){
//example call: valueToBinaryArray(5); 
	//returns [0,0,0,0,0,0,1,0,1]
	
	var returnArray = [0,0,0,0,0,0,0,0,0];

	if(value>=256){
		returnArray[0] = 1;
		value = value - 256
	}		
	if(value>=128){
		returnArray[1] = 1;
		value = value - 128
	}
	if(value>=64){
		returnArray[2] = 1;
		value = value - 64
	}
	if(value>=32){
		returnArray[3] = 1;
		value = value - 32
	}
	if(value>=16){
		returnArray[4] = 1;
		value = value - 16
	}
	if(value>=8){
		returnArray[5] = 1;
		value = value - 8
	}
	if(value>=4){
		returnArray[6] = 1;
		value = value - 4
	}
	if(value>=2){
		returnArray[7] = 1;
		value = value - 2
	}
	if(value>=1){
		returnArray[8] = 1;
		value = value - 1
	}
	if(value!=0){
		throw new Error("Binary Conversion Algorithm Incorrect")
	}
	
	return returnArray;
}

generateAllBinaryConfigurations = function(){
//returns an array of arrays containing all possible 9 bit binary configurations

	//Store for all possible configurations
	var allConfigs = [];

	for(var i=0; i<512; i++){
		
		allConfigs.push(valueToBinaryArray(i));
	}
	
	return allConfigs;
}