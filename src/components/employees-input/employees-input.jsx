import React, { useState } from 'react';
import EmployeesPair from '../employees-pair/'
import './employees-input.css';
import Button from '@material-ui/core/Button';

const EmployeesInput = (props) => {

	const [ employeesData, setEmployeesData ] = useState(null);
	const [ isError, setIsError ] = useState(false);

	const getCurrentDate = () => {
		//get current date in milliseconds and returns
		//in format yyyy-mm-dd
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		month = (month < 10) ? '0' + month : month;
		day = (day < 10) ? '0' + day : day;

		return `${year}-${month}-${day}`;
	}

	const parseEmployees = (arr) => {
		//array of rows without spacebars at the beginning and end
		//not map because we need to skip empty rows;
		let employees = [];
		arr.trim().split('\n').forEach(row => {
			if (row.trim() !== "") {
				employees.push(row.trim());
			}
		});

		//array of objects with employee info
		return employees.map( row => {
			let [ empID, projectID, dateFrom, dateTo] = row.split(', ');
			dateTo = (dateTo.toLowerCase() !== 'null') ? 
				dateTo : 
				getCurrentDate();

			return { 
				empID: +empID, 
				projectID: +projectID, 
				dateFrom, 
				dateTo	
			}
		})
	}

	const handleInputChange = (e) => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		if (file) {
			reader.readAsText(file);

			reader.onload = function() {
				let arr = reader.result;
				try {
					setEmployeesData(parseEmployees(arr));
					setIsError(false)
				}
				catch {
					setIsError(true)
				}
			};

			reader.onerror = function() {
				setIsError(true);
			};
		}
	}
		
	const outputData = (employeesData && !isError) ? 
			<EmployeesPair employeesData={employeesData} /> : 
			null;
	const errorMsg = (isError) ? <ErrorMessage /> : null;
	return (
		<div className="employees">
			<UploadForm 
				handleInputChange={handleInputChange}
			/>
			{ outputData }
			{ errorMsg}
		</div>
	)
}


const UploadForm = (props) => {
	return (
		<form className="upload__form" action="/">
			<div className="upload__file">
				<h3>Choose the file:</h3>
				<input 
					type="file" 
					name="sendEmployees"
					onChange={props.handleInputChange}
				/>
			</div>
		</form>
	)
}

const ErrorMessage = () => {
	return (
		<div className="error__message">
			<h3>
				Something went wrong. Probably invalid input data. 
			</h3>
			<h5> (if you edited the file after starting the 
				application, please reload the page)
			</h5>
		</div>
	)
}

export default EmployeesInput;