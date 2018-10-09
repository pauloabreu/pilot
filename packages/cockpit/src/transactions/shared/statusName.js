const statusNames = {
  analyzing: 'Em análise',
  authorized: 'Autorizada',
  cancelled: 'Cancelada',
  chargedback_refund: 'Chargeback reapresentado',
  chargedback: 'Chargeback',
  manual_review: 'Em revisão manual',
  paid: 'Paga',
  pending_refund: 'Estorno pendente',
  pending_review: 'Revisão pendente',
  processing: 'Processando pagamento',
  refunded: 'Estornada',
  suspended: 'Suspensa',
  refused: {
    acquirer: 'Recusada pela operadora de cartão',
    acquirer_timeout: 'Recusada por timeout da operadora de cartão',
    antifraud: 'Recusada pelo antifraude',
    capture_timeout: 'Recusada por timeout',
    internal_error: 'Erro interno',
    invalid_capture_amount: 'Recusada por dados inválidos',
    manual_review: 'Recusada revisão manual',
    manual_review_timeout: 'Revisão manual expirada',
    no_acquirer: 'Transação recusada por falta de configuração',
  },
  waiting_payment: 'Aguardando pagamento',
  waiting_funds: 'Aguardando pagamento',
}

export default statusNames
