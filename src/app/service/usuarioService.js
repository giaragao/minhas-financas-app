import ApiService from '../apiservice'
import ErroValidacao from '../exception/ErroValidacao'

class UsuarioService extends ApiService{
    constructor(){
        super('/api/usuarios')
    }

    autenticar(credenciais){
        return this.post('/autenticar', credenciais)
    }

    obterSaldoUsuario(id){
        return this.get(`/${id}/saldo`)
    }

    salvar(usuario){
        return this.post('/', usuario);
    }

    validar(usuario){
        const erros = []

        if (!usuario.nome){
            erros.push('Nome é obrigatório.')
        }

        if (!usuario.email){
            erros.push('E-mail é obrigatório.')
        } else if(!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            erros.push('E-mail inválido!')
        }

        if(!usuario.senha || !usuario.senhaRepeticao){
            erros.push('Preencha a senha nos dois campos.')
        }else if(usuario.senha !== usuario.senhaRepeticao){
            erros.push('As senha digitadas não são iguais!')
        }

        if(erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }
}

export default UsuarioService;