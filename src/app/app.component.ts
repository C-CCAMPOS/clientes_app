import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  //atributos
  endpoint: string = 'http://localhost:8080/api/clientes';
  clientes: any[] = [];
  pagina: number = 1;


  //método construtor
  constructor(
    private httpClient: HttpClient
  ) {
  }


  //função executada antes do componente abrir
  //executar rotinas no momento em que a página for aberta
  ngOnInit(): void {
    //fazendo uma requisição para o serviço GET /api/clientes
    this.httpClient.get(this.endpoint)
      .subscribe({
        next: (data) => {
          //armazenar os dados obtidos dentro da lista de clientes
          this.clientes = data as any[];
        }
      })
  }


  //formulário para capturar os campos do cadastro
  formCadastro = new FormGroup({
    nome: new FormControl('', []), //campo 'nome'
    email: new FormControl('', []), //campo 'email'
    cpf: new FormControl('', []) //campo 'cpf'
  });


  //formulário para capturar os campos da edição
  formEdicao = new FormGroup({
    idCliente: new FormControl('', []), //campo 'idCliente'
    nome: new FormControl('', []), //campo 'nome'
    email: new FormControl('', []), //campo 'email'
    cpf: new FormControl('', []) //campo 'cpf'
  });


  //função para realizar o cadastro do cliente
  cadastrarCliente(): void {
    //realizando a requisição POST para a API
    this.httpClient.post(this.endpoint, this.formCadastro.value)
      .subscribe({ //capturando o retorno da API
        next: (result: any) => {
          //exibindo a mensagem obtida da API
          alert(result.mensagem);
          //limpando os campos do formulário
          this.formCadastro.reset();
          //fazer uma nova consulta na API
          this.ngOnInit();
        }
      })
  }


  //função para executar a paginação da tabela
  executarPaginacao(event: any): void {
    this.pagina = event;
  }


  //função para capturar a chamada de exclusão
  //de um cliente selecionado
  excluirCliente(idCliente: number): void {


    if (window.confirm('Deseja realmente excluir o cliente selecionado?')) {
      //executando o serviço de exclusão da API
      this.httpClient.delete(this.endpoint + "/" + idCliente)
        .subscribe({
          next: (result: any) => {
            //exibindo a resposta do evento de exclusão
            alert(result.mensagem);
            //fazer uma nova consulta na API
            this.ngOnInit();
          }
        })
    }
  }


  //função para consultar os dados do cliente através do ID
  //e já preencher o formulário de edição com os valores
  obterCliente(idCliente: number): void {
    //executando o serviço de consulta de cliente por ID
    this.httpClient.get(this.endpoint + "/" + idCliente)
      .subscribe({
        next: (data: any) => {
          //preencher o formulário de edição com os dados do cliente
          this.formEdicao.patchValue(data);
        }
      })
  }


  //função para processar o SUBMIT do formulário de edição
  atualizarCliente(): void {
    //executando o serviço de edição de cliente na API
    this.httpClient.put(this.endpoint, this.formEdicao.value)
      .subscribe({
        next: (result: any) => {
          //exibindo a mensagem de sucesso
          alert(result.mensagem);
          //fazer uma nova consulta de clientes
          this.ngOnInit();
        }
      })
  }


}




