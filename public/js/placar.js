$("#botao-placar").click(mostraPlacar);
$("#botao-sync").click(sincronizaPlacar);

function inserePlacar() {
	var corpoTabela = $(".placar").find("tbody");
	var usuario = "Israel"
	var numPalavras = $("#contador-palavras").text();

	var linha = novaLinha(usuario, numPalavras);
	linha.find(".botao-remover").click(removeLinha);

	corpoTabela.prepend(linha);

	$(".placar").stop().slideDown(500);
	scrollPlacar();
}

function scrollPlacar() {
	var posicaoPlacar = $(".placar").offset().top;
	$("body").animate({
		scrollTop : posicaoPlacar+"px"
	}, 1000);
}

function novaLinha(usuario, numPalavras) {
	var linha = $("<tr>");
	var colunaUsuario = $("<td>").text(usuario);
	var colunaPalavras = $("<td>").text(numPalavras);
	var colunaRemover = $("<td>");
	var link = $("<a>").addClass("botao-remover").attr("href","#");
	var icone = $("<i>").addClass("small").addClass("material-icons").text("delete");

	link.append(icone);
	colunaRemover.append(link);

    linha.append(colunaUsuario);
    linha.append(colunaPalavras);
    linha.append(colunaRemover);

    return linha;
}

function removeLinha(event) {
	event.preventDefault();
	// Sobe na hierarquia (this = link -> parent() = <td> -> parent() = <tr>)
	var linha = $(this).parent().parent();
	linha.fadeOut(500);
	setTimeout(function() {
		linha.remove();
	}, 500)
}

function mostraPlacar() {
	$(".placar").stop().slideToggle(500);
}

function sincronizaPlacar(){
    var placar = [];
    var linhas = $("tbody>tr");

    linhas.each(function(){
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras = $(this).find("td:nth-child(2)").text();

        var score = {
            usuario: usuario,
            pontos: palavras            
        };

        placar.push(score); //guardando o score no array
    });

    var dados = {
            placar: placar
    };

	$("#spinner").toggle();
    $.post("http://localhost:3000/placar", dados, function(){
    	console.log("Placar sincronizado com sucesso");
    })
    .fail(function() {
		$("#erro").toggle();
		setTimeout(function() {
			$("#erro").toggle();
		}, 2000);
	})
	.always(function () {
		setTimeout(function() {
			$("#spinner").toggle();
		}, 1000);
	});
}

function atualizaPlacar(){
    $.get("http://localhost:3000/placar",function(data){
        $(data).each(function(){
            var linha = novaLinha(this.usuario, this.pontos);
            linha.find(".botao-remover").click(removeLinha);

            $("tbody").append(linha);
        });
    });
}