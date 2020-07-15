import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import { withRouter } from 'react-router-dom'
import * as messages from  '../../components/toastr'

import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'

class CadastroLancamentos extends React.Component{
    state = {
        id: null,
        descricao: '',
        valor: '',
        ano: '',
        mes: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    componentDidMount(){
        const params = this.props.match.params;

        if(params.id){
            this.service.obterPorId(params.id)
                .then(response => {
                    this.setState({...response.data, atualizando: true})
                })
                .catch(error => {
                    messages.mensagemErro(error.response.data)
                });
        }

        console.log(params);
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({[name] : value});
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const { descricao, valor, mes, ano, tipo } = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

        try{
            this.service.validar(lancamento);
        }catch(erro){
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }        

        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            });
    }

    atualizar = () =>{
        const { id, descricao, valor, mes, ano, tipo, status, usuario } = this.state;
        const lancamento = { id, descricao, valor, mes, ano, tipo, status, usuario };

        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            });
    }

    render(){
        const listaTipo = this.service.obterListaTipo();
        const listaMes = this.service.obterListaMes();

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição *">
                            <input id="inputDescricao" type="text" className="form-control" value={this.state.descricao}
                                                       name="descricao" onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano *">
                            <input id="inputAno" type="text" className="form-control" value={this.state.ano}
                                                 name="ano" onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês *">
                            <SelectMenu id="inputMes" lista={listaMes} className="form-control" 
                                        value={this.state.mes} name="mes" onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor *">
                            <input id="inputValor" type="text" className="form-control" value={this.state.valor}
                                                   name="valor" onChange={this.handleChange}  />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo *">
                            <SelectMenu id="inputTipo" lista={listaTipo} className="form-control" 
                                        value={this.state.tipo} name="tipo" onChange={this.handleChange}  />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Situação *">
                            <input id="inputStatus" type="text" className="form-control"
                                   value={this.state.status} name="status" disabled />
                        </FormGroup>
                    </div>                    
                </div>
                <div className="row">
                    <div className="col-md-4">
                        {
                            this.state.atualizando ?
                            (<button onClick={this.atualizar} type="button" className="btn btn-primary">Atualizar</button>) :
                            (<button onClick={this.submit} type="button" className="btn btn-success">Salvar</button>)
                        }
                        &nbsp;<button onClick={e => this.props.history.push('/consulta-lancamentos')} type="button" className="btn btn-danger">Cancelar</button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);