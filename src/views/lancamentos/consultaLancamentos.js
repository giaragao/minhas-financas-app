import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localStorageService'
import * as messages from '../../components/toastr'
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

class ConsultaLancamentos extends React.Component{

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: [], 
        mostraGrid: false
    }

    constructor(){
        super();
        this.service = new LancamentoService;
    }

    buscar = () => {
        if (!this.state.ano){
            messages.mensagemErro('Favor preencher o campo ano!')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;

                if (lista.length < 1){
                    this.state.mostraGrid = false;
                    messages.mensagemAlerta('Nenhum lançamento encontrado!');
                }
                else {
                    this.state.mostraGrid = true;
                }

                this.setState({lancamentos: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    alterarStatus = (lancamento,status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                
                if(index !== -1){
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({lancamento});
                }
                
                messages.mensagemSucesso('Status atualizado com sucesso!')
            })
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog:true, lancamentoDeletar: lancamento})
    }

    cancelarExclusao = () => {
        this.setState({ showConfirmDialog:false, lancamentoDeletar: {}})
    }

    excluir = () => {
        this.service
            .excluir(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.lancamentoDeletar);
                lancamentos.splice(index,1);
                this.setState( {lancamentos: lancamentos, showConfirmDialog: false });

                messages.mensagemSucesso('Lançamento excluído com sucesso!');
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro na exclusão do lançamento.')
            })
    }

    formularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    render(){
        const listaMes = this.service.obterListaMes();
        const listaTipo = this.service.obterListaTipo();

        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" className="p-button-success" icon="pi pi-check" onClick={this.excluir} />
                <Button label="Cancelar" className="p-button-danger" icon="pi pi-times" onClick={this.cancelarExclusao} />
            </div>
        );

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup label="Ano *" htmlFor="inputAno">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputAno" 
                                       value={this.state.ano}
                                       onChange={e => this.setState({ano: e.target.value})} 
                                       placeholder="Digite o Ano"/>
                            </FormGroup>
                            <FormGroup label="Mês" htmlFor="inputMes">
                                <SelectMenu id="inputMes" 
                                            value={this.state.mes}
                                            onChange={e => this.setState({mes: e.target.value})}
                                            className="form-control"    
                                            lista={listaMes} />
                            </FormGroup>
                            <FormGroup label="Descrição" htmlFor="inputDesc">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputDesc" 
                                       value={this.state.descricao}
                                       onChange={e => this.setState({descricao: e.target.value})} 
                                       placeholder="Digite a Descrição"/>
                            </FormGroup>
                            <FormGroup label="Tipo de Lançamento *" htmlFor="inputTipo">
                                <SelectMenu id="inputTipo" 
                                            value={this.state.tipo}
                                            onChange={e => this.setState({tipo: e.target.value})}
                                            className="form-control" 
                                            lista={listaTipo} />
                            </FormGroup>

                            <button onClick={this.buscar} type="button" className="btn btn-success">Buscar</button>&nbsp;
                            <button onClick={this.formularioCadastro} type="button" className="btn btn-danger">Cadastrar</button>
                        </div>
                    </div>
                </div>
                <br />
                {
                    this.state.mostraGrid ?
                    (<div className="row">
                        <div className="col-md-12">
                            <div className="bs-component">
                                <LancamentosTable lancamentos={this.state.lancamentos} 
                                                updateAction={this.editar}
                                                deleteAction={this.abrirConfirmacao} 
                                                statusAction={this.alterarStatus} />
                            </div>
                        </div>
                    </div>) : (<div className="row"></div>)
                }
                
                <div>
                    <Dialog header="Confirma exclusão?" 
                            visible={this.state.showConfirmDialog} 
                            style={{width: '50vw'}} 
                            footer={confirmDialogFooter}
                            modal={true} 
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Deseja realmente excluir esse lançamento?
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter (ConsultaLancamentos)