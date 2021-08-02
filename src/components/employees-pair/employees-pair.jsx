import { DataGrid } from '@material-ui/data-grid';

import './employees-pair.css';

const EmployeesPair = (props) => {

	const replaceAll = (str, search, replace) => {
		return str.split(search).join(replace);
	}

	const formatDate = (date) => {
		// format something like "2021-07-13" to Date
		date = replaceAll(date, '−', '-')
		date = replaceAll(date, '–', '-')
		let t1 = date.split('-').map(el => +el);
		return new Date(t1[0], t1[1] - 1, t1[2])
	}

	const dateDifference = (d1, d2) => {
		//difference betweeen 2 dates in days
		return Math.trunc(Math.abs((d1 - d2)/(60 * 60 * 24 * 1000)) + 1);
	}

	const datesIntersection = ([x1, x2], [y1, y2]) => {
		//calculating the intersection of 2 intervals

		//if the first interval starts after the second, 
		//we swap them to simplify further calculations
		if (x1 > y1) {
			[[x1, x2], [y1, y2]] = [[y1, y2], [x1, x2]]
		}
		
		//---x1---y1---y2---x2--- (intersection (y1, y2))
		if (x2 >= y2) return dateDifference(y2, y1);
		//---x1---y1---x2---y2--- (intersection (y1, x2))
		else if (x2 >= y1) return dateDifference(x2, y1);
		//---x1---x2---y1---y2--- (no intersection)
		else return 0;
	}

	const getPair = (arr) => {
		const pairs = {};
		for (let i = 0; i < arr.length - 1; i++) {
			for (let j = i + 1; j < arr.length; j++) {
				//comparation each 2 employees
				const currentID = arr[i].empID;
				const currentProjectID = arr[i].projectID;
				const currentFrom = formatDate(arr[i].dateFrom);
				const currentTo = formatDate(arr[i].dateTo);

				const nextID = arr[j].empID;
				const nextProjectID = arr[j].projectID;
				const nextFrom = formatDate(arr[j].dateFrom);
				const nextTo = formatDate(arr[j].dateTo);

				//calculating number of days worked together
				const daysWorked = datesIntersection(
						[currentFrom, currentTo], [nextFrom, nextTo]);

				//skip invalid data
				if (daysWorked < 1) continue;
				if (currentProjectID !== nextProjectID) continue;
				if (currentFrom >  currentTo || nextFrom > nextTo) continue;

				const key1 = `${currentID}-${nextID}`;
				const key2 = `${nextID}-${currentID}`;
				const key = (key2 in pairs) ? key2 : key1;

				if (key in pairs) {
					pairs[key].daysWorked += daysWorked;
					pairs[key].projectIDS.push({ projectID: currentProjectID, daysWorked });

				} 
				else {
					pairs[key] = {
						empID1: currentID,
						empID2: nextID,
						projectIDS: [{ projectID: currentProjectID, daysWorked }],
						daysWorked
					};
				}
			}
		}
		
		if (Object.keys(pairs).length === 0) {
			return null;
		} 
		else {
			let maxPair = {daysWorked: 0};
			for (let key in pairs) {
				if (pairs[key].daysWorked >= maxPair.daysWorked) {
					maxPair = pairs[key];
				}
			}
			return maxPair;
		}
	}

	const getTable = (employeesData) => {

		const { empID1: id1, empID2: id2, projectIDS } = employeesData;

		const columns = [
			{ field: 'id', headerName: 'ID', width: 60, hide: true},
			{ field: 'id1', headerName: 'Employee ID #1', width: 180},
			{ field: 'id2', headerName: 'Employee ID #2', width: 180 },
			{ field: 'projectID', headerName: 'Project ID', width: 180 },
			{ field: 'days', headerName: 'Days worked', width: 180 },
		].map(col => ({...col, sortable: false, filterable: false}));

		const rows = projectIDS.map( (project, index) => {
			return { 
				id: index, 
				id1, 
				id2, 
				projectID: project.projectID, 
				days: project.daysWorked 
			}
		});
		return { rows, columns }
	}

	const employeesData = getPair(props.employeesData);
	let content;

	if (employeesData) {
		const { rows, columns } = getTable(employeesData);
		content = <EmployeesTable columns={columns}	rows={rows}/>
	}
	else {
		content = <h3>This file doesn't have a pair of employees matching the condition</h3>
	}
	
	return (
		<>
			{ content }
		</>
	)
}


const EmployeesTable = ({ rows, columns }) => {

	return (
		<div className="employees-table">
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={6}
				checkboxSelection
				disableSelectionOnClick
			/>
		</div>
	)
}

export default EmployeesPair;