import { useState } from "react";
import styles from './Styles/FundTransfer.module.css';
import axios from "axios";

const UpdatePassword = () => {

    const [values, setValue] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue({ ...values, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(values.new_password!==values.confirm_password){
            alert("New password and confirm password not matched.");
            return;
        }

        const data = {
            'currentPassword': values.current_password,
            'newPassword': values.new_password,
        }

        console.log({ data });

        const jwttoken = localStorage.getItem('jsonwebtoken');
        console.log("token " + jwttoken)
        const config = {
            method: 'post',
            url: 'http://localhost:8080/api/updatePassword',
            headers: {
                'Authorization': 'Bearer ' + jwttoken,
            },
            data: data
        };

        axios.request(config).then(e => {
            console.log(e.data)
            alert(e.data);
        }).catch(e => {
            alert(e.response.data);
            console.log(e.response)
        });

    }

    return (
        <div id="particles-js" className={styles.registerContainer}>

            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Update Password</h1>
                <form className={styles.registerForm} onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label htmlFor="name" className="styles.formGroup">Current password :</label>
                        <input
                            id="name"
                            type="text"
                            name="current_password"
                            value={values.current_password}
                            required
                            placeholder="Current Password"
                            onChange={handleChange}
                            className={styles.inputLg}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name" className="styles.formGroup">New password :</label>
                        <input
                            id="name"
                            type="text"
                            name="new_password"
                            value={values.new_password}
                            required
                            placeholder="New password"
                            onChange={handleChange}
                            className={styles.inputLg}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name">Confirm password :</label>
                        <input
                            id="name"
                            type="text"

                            name="confirm_password"
                            value={values.confirm_password}
                            required
                            onChange={handleChange}
                            className={styles.inputLg}
                            placeholder="Confirm password"
                        />
                    </div>



                    <button type="submit" className={styles.btnPrimary}>Update</button>
                </form>
            </div>
        </div>
    )

}
export default UpdatePassword;