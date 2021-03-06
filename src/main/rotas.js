import React from 'react';
import Home from '../views/home'
import Login from '../views/login'
import CadatroUsuario from '../views/cadastroUsuario'
import ConsultaLancamentos from '../views/lancamentos/consultaLancamentos'
import CadastroLancamentos from '../views/lancamentos/cadastroLancamentos'
import { AuthConsumer } from '../main/provedorAutenticacao'

import {Route, Switch, HashRouter, Redirect} from 'react-router-dom'

function RotaAutenticada({component: Component, isUsuarioAutenticado, ...props}){
    return (
        <Route {...props} render={(componentProps) => {
            if(isUsuarioAutenticado){
                return (<Component {...componentProps}/>)
            }
            else{
                console.log('não autenticado')
                return (<Redirect to={{pathname:'/login', state: {from: componentProps.location}}} />)
            }
        }} />
    )
}

function Rotas(props){
    return(
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/cadastro-usuarios" component={CadatroUsuario}/>

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-lancamentos" component={ConsultaLancamentos}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-lancamentos/:id?" component={CadastroLancamentos}/>
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />) }
    </AuthConsumer>
)