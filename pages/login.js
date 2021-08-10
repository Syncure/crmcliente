import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useRouter } from 'next/router';

import { useMutation, gql } from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
    mutation AutenticarUsuarioMutation($input: AutenticarInput) {
        autenticarUsuario(input: $input) {
            token
        }
    }
`;

const login = () => {

    // Usar el Mutation
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
    
    // State para el mensaje
    const [ mensaje, setMensaje ] = useState(null);

    // Usar use Router
    const router = useRouter();


    // Validación con Formik
    const formik = useFormik({
        initialValues : {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El formato del email es incorrecto').required('El email no puede estar ir vacío'),
            password: Yup.string().required('El password no puede estar vacío')
        }),
        onSubmit: async valores => {
            const { email, password } = valores
            console.log(email, password);

            try {
                const { data } = await autenticarUsuario({
                    variables:{
                        input: { 
                            email,
                            password
                        }
                    }
                })
                
                // Guardar Token en localStorage
                setTimeout(() => {
                    const { token } = data.autenticarUsuario
                    localStorage.setItem('token', token)  
                }, 1000);
                
                setMensaje("Autenticando");  
                // Redireccionar al cliente
                setTimeout(() => {
                    router.push('/')
                    setMensaje(null);    
                }, 1500);
                

            } catch (error) {
                setMensaje(error.message);

                setTimeout(() => {
                    setMensaje(null);  
                }, 1500);
            }
        }
    })

    // Mostrar Mensaje
    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        )
    }


    return (
        <>
            <Layout>

                {mensaje && mostrarMensaje() }

                <h1 className="text-center text-2xl font-light text-white">Login</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email                
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    id = "email"
                                    type = "email"
                                    placeholder="Email Usuario"
                                    value = { formik.values.email }
                                    onChange = { formik.handleChange }
                                    onBlur = { formik.handleBlur }
                                />
                            </div>

                            {formik.touched.email && formik.errors.email && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password               
                                </label>
                                <input 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    id = "password"
                                    type = "password"
                                    placeholder = "Password Usuario"
                                    value = { formik.values.password }
                                    onBlur = { formik.handleBlur }
                                    onChange = { formik.handleChange } 
                                />
                            </div>

                            {formik.touched.password && formik.errors.password && (
                                
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            )}

                            <input 
                                type="submit" 
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:cursor-pointer hover:bg-gray-900"
                                value="Iniciar Sesión"    
                            />
                        </form>
                    </div>
                </div> 
            </Layout>
        </>
    )
}

export default login
