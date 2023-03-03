import axios from 'axios';

const url = 'https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/departments.json'
export const fetchDepartment = async(setState: (a: any) => void , setError:  (a: string | null) => void) => {
    axios.get(url).
    then(response => {
        setState(response.data)
        setError(null)
    } ).
    catch(function (error) {
        setError(error.message)
      })
}
