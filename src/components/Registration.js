import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

const Registration = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentTerm,setCurrentTerm] = useState('');
    const [years, setYears] = useState([]);
    const [terms, setTerms] = useState([]);
    const [message, setMessage] = useState(null);

    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        const year =  new Date().getFullYear();
        let yearData = [];
        for(let i = year - 10; i < year + 5; i++){
            yearData.push(i);
        }
        yearData.sort();
        setYears(yearData);
        
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/terms');
                const termData = await response.data;
                termData.sort((a, b) => a.term - b.term);
                setTerms(termData);

                for (let i = termData.length - 1; i >= 0; i--) {
                    if (termData[i].startmonth >= new Date().getMonth()) {
                        setCurrentTerm(termData[i].term);
                        break;
                    }
                }
            } catch (error) {
                setMessage(`Error fetching terms: ${error}`);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if(studentNumber === '' || currentYear === '' || currentTerm === '') return;

        const fetchData = async () => {
            setRegistrations([]);
            try{
                const response = await axios.get(`http://localhost:8080/api/registrations/bystudentidyearterm/${studentNumber}/${currentYear}/${currentTerm}`);
                const result = await response.data;
                if(result.length > 0){
                    setRegistrations(result);
                    setMessage(null);
                }else{
                    setMessage(`Student is not registered for this term`);
                }
            }catch(err){
                setMessage(`Error fetching data: ${err}`);
            }
            
        }
        const timeoutId = setTimeout(fetchData, 500);
        setMessage(`Registered Subjects: ${registrations.length}`);
        return () => clearTimeout(timeoutId);
    }, [studentNumber,currentYear,currentTerm]);

    return (
        <div>
            <h2>Registration Form</h2>
            <div>
                <div>
                    <span>
                        <label>Year: </label>
                            <select 
                                name="tyear"
                                value={currentYear}
                                onChange={(e) => setCurrentYear(e.target.value)}
                                required
                            >
                                {years.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                    </span>
                    <span>
                        <label>Term: </label>
                            <select 
                                name="term"
                                value={currentTerm}
                                onChange={(e) => setCurrentTerm(e.target.value)}
                                required
                            >
                                {terms.map((term) => (
                                    <option key={term.termid} value={term.term}>
                                        {term.term}
                                    </option>
                                ))}
                            </select>
                    </span>
                </div>
            
                <div>
                    <h3> 
                        <label>StudentID: </label>
                        <input
                            name="studentid"
                            type="number"
                            value = {studentNumber}
                            onChange = {(e) => setStudentNumber(e.target.value)}
                            placeholder="Type your StudentID"
                            required
                        />
                    </h3>
                </div>
            </div>
            {message && <p>{message}</p>}
            <div align="center">
            {registrations.length > 0 && (
            <table boder="1">
                <thead>
                    <tr>
                        <th>
                            <input
                                name="student_id"
                                type="number"
                                value={registrations[0].studentid}
                            />
                        </th>
                        <th>
                            <input
                                name="firstname"
                                type="text"
                                value={registrations[0].student.firstname}
                            />
                        </th>
                        <th>
                            <input
                                name="surname"
                                type="text"
                                value={registrations[0].student.surname}
                            />
                        </th>
                        <th>
                            <input
                                name="grade"
                                type="text"
                                value={registrations[0].grade}
                            />
                        </th>
                    </tr>
                </thead>
            </table>
            )}
            </div>

            
            {registrations.length > 0 && (
            <h3>Registered Subjects</h3>
            )}
            <div align="center">
            {registrations.length > 0 && (
            <table border="1">
                <thead>
                    <tr>
                        <th>SubjectID</th>
                        <th>Subject</th>
                        <th>Term Ave</th>
                        <th>Exam Mark</th>
                        <th>Symbol</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                    <tbody>
                        {registrations.map((data) => (
                            <tr key={data.registrationid}>
                                <td>{data.subjectid}</td>
                                <td>{data.subject.title}</td>
                                <td>{data.tavemark}</td>
                                <td>{data.exammark}</td>
                                <td>{data.symbol}</td>
                                <td>{data.comments}</td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            )}
            </div>
        </div>
    );

    
};

export default Registration;