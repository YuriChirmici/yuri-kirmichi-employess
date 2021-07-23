import { DataGrid } from '@material-ui/data-grid';

import './employees-pair.css';

const EmployeesPair = (props) => {

	const formatDate = (date) => {
		// format something like "2021-07-13" to milliseconds
		let t1 = date.split('-').map(el => +el);
		return new Date(t1[0], t1[1], t1[2])
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

		//divided information about workers by project id
		//created an array where will be shown the pair with the 
		//maximum days of work together(if it exists) of each project
		const projects = {};
		arr.forEach( el => {
			if (el.projectID in projects) {
				projects[el.projectID].push(el);
			}
			else {
				projects[el.projectID] = [el];
			}
		})

		const projectsMaxPairs = []

		for (let key in projects) {
			let maxPair = null;

			//we can find the pair if we have more then 1 employee
			if (projects[key].length > 1) {
				for (let i = 0; i < projects[key].length - 1; i++) {
					for (let j = i + 1; j < projects[key].length; j++) {
						//comparation each 2 employees in current project
						const currentFrom = formatDate(projects[key][i].dateFrom);
						const currentTo = formatDate(projects[key][i].dateTo);
						const currentID = projects[key][i].empID;

						const nextFrom = formatDate(projects[key][j].dateFrom);
						const nextTo = formatDate(projects[key][j].dateTo);
						const nextID = projects[key][j].empID;

						const projectID = projects[key][i].projectID;

						//calculating number of days worked together
						const daysWorked = datesIntersection(
								[currentFrom, currentTo], [nextFrom, nextTo]);

						const employeesPair = {
							empID1: currentID, 
							empID2: nextID, 
							projectID,
							daysWorked
						}

						if (maxPair) {
							//if the maximal pair exists, we compare the number of days
							if (maxPair.daysWorked < daysWorked) {
								maxPair = {...employeesPair}
							}
						} 
						else {
							//else the current pair becomes the maximum without checking
							maxPair = {...employeesPair}
						}
					}
				}
			}
			//if this project has maximal pair, we add it to an array
			if (maxPair) {
				projectsMaxPairs.push(maxPair);
			}
		}

		//if the list of maximum pairs of each project is not empty
		//we search for the maximal of them
		if (projectsMaxPairs.length === 0) {
			return null;
		} 
		else {
			return projectsMaxPairs.reduce((max, pair) => {
				return (pair.daysWorked > max.daysWorked) ? pair : max;
			}, {...projectsMaxPairs[0]});
		}
	}

	const employeesData = getPair(props.employeesData);
	const {empID1: id1, empID2: id2, projectID, 
	daysWorked: days} = employeesData;

	const columns = [
		{ field: 'id', headerName: 'ID', width: 60, hide: true},
		{ field: 'id1', headerName: 'Employee ID #1', width: 180},
		{ field: 'id2', headerName: 'Employee ID #2', width: 180 },
		{ field: 'projectID', headerName: 'Project ID', width: 180 },
		{ field: 'days', headerName: 'Days worked', width: 180 },
	].map(col => ({...col, sortable: false, filterable: false}));

	const rows = [{ id: 1, id1, id2, projectID, days }];

	return (
		<EmployeesTable columns={columns}	rows={rows}/>
	)
}


const EmployeesTable = ({ rows, columns }) => {

	return (
		<div className="employees-table">
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				checkboxSelection
				disableSelectionOnClick
			/>
		</div>
	)
}

export default EmployeesPair;