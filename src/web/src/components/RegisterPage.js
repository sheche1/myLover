import React, { useState } from 'react';

function RegisterPage() {

    const [formData, setFormDaata] = useState({
        email:'',
        password:'',
        name:'',

    });
    const [message , setMessage] = useState('');

    const handleChange = (e) =>{
        setFormDaata({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit= async(e) =>{
        e.preventDefault();
        setMessage('');

        try{
            const response = await fetch('http://localhost:8080/api/auth/register',
                {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body:JSON.stringify(formData),
                }
            );
            if(response.ok){
                const data = await response.json();
                setMessage('Registro exitoso!Ahora puedes iniciar sesión');
            }else{
                const errordata = await response.json();
                setMessage(`Error:${errordata.message ||'Algo salió mal'}`);
            }
        }catch(error){
            console.error('Error duante el registro:',error);
            setMessage('Error al conectar con el servidor.');
        }
    };

    return (
        <div style={{textAlign:'center',marginTop:'50px'}}>
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{marginBottom:'10px',padding:'10px',width:'300px'}}
                        />
                    </div>
                    <div>
                    <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{marginBottom:'10px',padding:'10px',width:'300px'}}
                        />
                    </div>
                    <div>
                    <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{marginBottom:'10px',padding:'10px',width:'300px'}}
                        />
                    </div>
                    <button type="submit" style={{padding:'10px 20px',frotSize:'16px'}}>Registrar</button>
                </form>
                {message && <p style={{marginTop:'20px',color:'red'}}>{message}</p>}
        </div>
    );
}

export default RegisterPage;
