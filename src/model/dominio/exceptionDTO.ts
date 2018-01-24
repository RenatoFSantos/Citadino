export class ExceptionDTO implements Error {
    public name: string;
    public message: string;
    public stack: string;

    /*
        0 error na trasacao pegar cupom
        1 Quantidade de cupom indisponível
        2 Nao foi possível gravar o meu cupom;
    */
}