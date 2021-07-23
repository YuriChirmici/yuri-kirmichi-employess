import React from 'react';

import './employee-input.css';

const EmployeeInput = (props) => {

	const handleInputChange = (e) => {
		e.preventDefault();

		let reader = new FileReader();
		let file = fileRef.current.files[0];

		reader.readAsText(file);

		reader.onload = function() {
			//to get array of rows without spacebars 
			//at the beginning and end
			let arr = reader.result.split('\n').map(row => row.trim())
			console.log(arr);
		};

		reader.onerror = function() {
			console.log(reader.error);
		};
	}

	const fileRef = React.createRef();

	return (
		<form action="">
			<input 
				type="file" 
				name="sendEmployees"
				ref={fileRef}
			/>

			<button 
				className="btn btn-outline-primary"
				onClick={handleInputChange}
			>
				get
			</button>
		</form>
	)
}

export default EmployeeInput;

