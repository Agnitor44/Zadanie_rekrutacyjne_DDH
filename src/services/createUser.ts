import axios from 'axios';

const url = `https://ddh-front-default-rtdb.europe-west1.firebasedatabase.app/users.json`;

export const createUser = async(payload: object, setState: (a: boolean) => void , setError:  (a: string | null) => void) => {
    // "Permission denied"
    axios.put(url, payload).
    then(response => {
        setState(true)
        setError(null)
    } ).
    catch(function (error) {
        setError(error.message)
        console.log(error)
      })
}

