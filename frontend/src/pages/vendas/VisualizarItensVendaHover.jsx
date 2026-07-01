import { useEffect, useRef } from "react";
import { Popover } from "bootstrap";

function VisualizarItensVendaHover({ venda }) {
    const elementoRef = useRef(null);

    // Soma a quantidade física de produtos na venda
    const totalItens = venda.itens?.reduce((acc, curr) => acc + (curr.quant || 0), 0) || 0;

    // Formata o valor total monetário da venda
    const totalDinheiro = venda.total || venda.valorTotal
        ? (venda.total || venda.valorTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "R$ 0,00";

    // Tradução amigável do Enum FormaPagamento para exibição no cabeçalho
    const formatarFormaPagamento = (forma) => {
        if (forma === "CARTAO") return "Cartão";
        if (forma === "PIX") return "PIX";
        if (forma === "DINHEIRO") return "Dinheiro";
        return "Não informada";
    };

    const cardHtml = `
        <div class="card border-0 shadow-lg rounded-3 overflow-hidden" style="width: 320px; margin: 0 !important;">
            <div class="card-header bg-dark text-white p-3 border-0">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-cart-check text-success fs-5"></i>
                    <div>
                        <h6 class="fw-bold m-0" style="font-size: 0.9rem;">Resumo da Venda #${venda.id}</h6>
                        <small class="text-uppercase text-white" style="font-size: 10px;">Pagamento: ${formatarFormaPagamento(venda.formaPagamento)}</small>
                    </div>
                </div>
            </div>
            <div class="card-body p-0 bg-white" style="max-height: 220px; overflow-y: auto;">
                <table class="table align-middle table-borderless table-hover m-0" style="font-size: 0.8rem;">
                    <thead class="bg-light text-secondary border-bottom sticky-top">
                        <tr>
                            <th class="ps-3 py-2 text-uppercase" style="font-size: 10px;">Item</th>
                            <th class="text-center py-2 text-uppercase" style="width: 60px; font-size: 10px;">Qtd</th>
                            <th class="text-end pe-3 py-2 text-uppercase" style="width: 90px; font-size: 10px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${venda.itens && venda.itens.length > 0 ? (
        venda.itens.map(item => `
                                <tr class="border-bottom border-light">
                                    <td class="ps-3 py-2">
                                        <div class="fw-semibold text-dark">${item.nomeProduto || "Produto"}</div>
                                        <small class="text-muted" style="font-size: 10px;">#${item.produtoId}</small>
                                    </td>
                                    <td class="text-center py-2">
                                        <span class="badge bg-light text-dark border px-2 py-1">${item.quant}</span>
                                    </td>
                                    <td class="text-end pe-3 py-2 text-secondary fw-medium">
                                        ${item.subtotal ? item.subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 0,00"}
                                    </td>
                                </tr>
                            `).join('')
    ) : (
        '<tr><td colSpan="3" class="text-center text-muted py-3">Nenhum item lançado.</td></tr>'
    )}
                    </tbody>
                </table>
            </div>
            <div class="card-footer bg-light p-3 border-top d-flex justify-content-between align-items-center" style="font-size: 0.8rem;">
                <span class="text-secondary fw-medium">Vol: ${totalItens} unds</span>
                <span class="fw-bold text-dark fs-6">Total: ${totalDinheiro}</span>
            </div>
        </div>
    `;

    useEffect(() => {
        const elemento = elementoRef.current;
        if (!elemento) return;

        const popoverInstance = new Popover(elemento, {
            content: cardHtml,
            html: true,
            trigger: "hover focus",
            placement: "top",
            sanitize: false,
            container: "body",
        });

        return () => {
            popoverInstance.dispose();
        };
    }, [venda, cardHtml]);

    return (
        <span
            ref={elementoRef}
            className="badge bg-light text-dark border px-3 py-2 rounded-pill shadow-sm"
            style={{ cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
        >
            <i className="bi bi-eye text-primary me-1"></i>
            {venda.itens?.length || 0} prod(s)
        </span>
    );
}

export default VisualizarItensVendaHover;