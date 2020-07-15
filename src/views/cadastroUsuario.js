import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import { mensagemSucesso, mensagemErro } from '../components/toastr'

class CadastroUsuario extends React.Component{
    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    cadastrar = () => {
        const { nome, email, senha, senhaRepeticao} = this.state;
        const usuario = { nome,email,senha,senhaRepeticao };

        try {
            this.service.validar(usuario);

        } catch(erro) {
            const msgs = erro.mensagens;
            msgs.forEach(msg => mensagemErro(msg));
            return false
        }

        this.service.salvar(usuario)
            .then( response => {
                mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.')
                this.props.history.push('/login')
            }).catch( error => {
                mensagemErro(error.response.data)
            })
    }

    cancelar = () => {
        this.props.history.push('/login')
    }

    render(){
        return(
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text"
                                    className="form-control" 
                                    id="inputNome" 
                                    placeholder="Digite o Nome"
                                    name="nome"
                                    onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="E-mail: *" htmlFor="inputEmail">
                                <input type="email"
                                    className="form-control" 
                                    id="inputEmail" 
                                    placeholder="Digite o E-mail"
                                    name="email"
                                    onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input type="password"
                                    className="form-control" 
                                    id="inputSenha" 
                                    placeholder="Digite a Senha"
                                    name="senha"
                                    onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup>                                
                            <FormGroup label="Repita a Senha: *" htmlFor="inputRepSenha">
                                <input type="password"
                                    className="form-control" 
                                    id="inputRepSenha" 
                                    placeholder="Repita a Senha"
                                    name="senha"
                                    onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>
                            <button onClick={this.cadastrar} type="button" className="btn btn-success">Salvar</button>&nbsp;
                            <button onClick={this.cancelar} type="button" className="btn btn-danger">Cancelar</button> 
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroUsuario)