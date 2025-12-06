// src/test/utils/helpers/DateHelper.test.js

import DateHelper from '../../../utils/helpers/DateHelper.js';

describe('DateHelper', () => {
  describe('brToIso', () => {
    it('deve converter data brasileira para ISO', () => {
      expect(DateHelper.brToIso('15/03/1990')).toBe('1990-03-15');
      expect(DateHelper.brToIso('01/01/2000')).toBe('2000-01-01');
      expect(DateHelper.brToIso('31/12/2023')).toBe('2023-12-31');
    });

    it('deve retornar null para valores vazios', () => {
      expect(DateHelper.brToIso(null)).toBe(null);
      expect(DateHelper.brToIso(undefined)).toBe(null);
      expect(DateHelper.brToIso('')).toBe(null);
    });
  });

  describe('isoToBr', () => {
    it('deve converter data ISO para brasileiro', () => {
      expect(DateHelper.isoToBr('1990-03-15')).toBe('15/03/1990');
      expect(DateHelper.isoToBr('2000-01-01')).toBe('01/01/2000');
      expect(DateHelper.isoToBr('2023-12-31')).toBe('31/12/2023');
    });

    it('deve converter objeto Date para brasileiro', () => {
      const date = new Date(1990, 2, 15); // mês é 0-indexed: março = 2
      expect(DateHelper.isoToBr(date)).toBe('15/03/1990');
    });

    it('deve retornar null para valores vazios', () => {
      expect(DateHelper.isoToBr(null)).toBe(null);
      expect(DateHelper.isoToBr(undefined)).toBe(null);
      expect(DateHelper.isoToBr('')).toBe(null);
    });
  });

  describe('isValidBrFormat', () => {
    it('deve validar formato brasileiro correto', () => {
      expect(DateHelper.isValidBrFormat('15/03/1990')).toBe(true);
      expect(DateHelper.isValidBrFormat('01/01/2000')).toBe(true);
      expect(DateHelper.isValidBrFormat('31/12/2023')).toBe(true);
    });

    it('deve rejeitar formatos inválidos', () => {
      expect(DateHelper.isValidBrFormat('1990-03-15')).toBe(false);
      expect(DateHelper.isValidBrFormat('15-03-1990')).toBe(false);
      expect(DateHelper.isValidBrFormat('15/3/1990')).toBe(false);
      expect(DateHelper.isValidBrFormat('32/01/2023')).toBe(false);
      expect(DateHelper.isValidBrFormat('15/13/2023')).toBe(false);
      expect(DateHelper.isValidBrFormat(null)).toBe(false);
      expect(DateHelper.isValidBrFormat('')).toBe(false);
    });

    it('deve validar datas reais', () => {
      expect(DateHelper.isValidBrFormat('29/02/2020')).toBe(true); // ano bissexto
      expect(DateHelper.isValidBrFormat('29/02/2021')).toBe(false); // não bissexto
      expect(DateHelper.isValidBrFormat('31/04/2023')).toBe(false); // abril tem 30 dias
    });
  });

  describe('isMaiorDeIdade', () => {
    it('deve validar se é maior de 18 anos', () => {
      const hoje = new Date();
      const anos18Atras = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
      const anos19Atras = new Date(hoje.getFullYear() - 19, hoje.getMonth(), hoje.getDate());
      const anos17Atras = new Date(hoje.getFullYear() - 17, hoje.getMonth(), hoje.getDate());

      expect(DateHelper.isMaiorDeIdade(DateHelper.dateToBr(anos18Atras))).toBe(true);
      expect(DateHelper.isMaiorDeIdade(DateHelper.dateToBr(anos19Atras))).toBe(true);
      expect(DateHelper.isMaiorDeIdade(DateHelper.dateToBr(anos17Atras))).toBe(false);
    });

    it('deve considerar mês e dia no cálculo da idade', () => {
      const hoje = new Date();
      const dia = hoje.getDate();
      const mesAtual = hoje.getMonth(); // 0-11
      const mesUsuario = mesAtual + 1; // 1-12
      const ano18AtrasAniversarioPassed = hoje.getFullYear() - 18;

      // Data onde o aniversário JÁ PASSOU esse ano (mês anterior)
      const mesPassed = mesUsuario === 1 ? 12 : mesUsuario - 1;
      const anoMesPassed = mesPassed === 12 ? ano18AtrasAniversarioPassed - 1 : ano18AtrasAniversarioPassed;
      const dataJaFezAniversario = `${String(dia).padStart(2, '0')}/${String(mesPassed).padStart(2, '0')}/${anoMesPassed}`;
      expect(DateHelper.isMaiorDeIdade(dataJaFezAniversario)).toBe(true);
    });

    it('deve retornar false para valores inválidos', () => {
      expect(DateHelper.isMaiorDeIdade(null)).toBe(false);
      expect(DateHelper.isMaiorDeIdade('')).toBe(false);
    });
  });

  describe('dateToBr', () => {
    it('deve converter Date para formato brasileiro', () => {
      const date = new Date(1990, 2, 15); // mês é 0-indexed
      expect(DateHelper.dateToBr(date)).toBe('15/03/1990');
    });

    it('deve retornar null para valores inválidos', () => {
      expect(DateHelper.dateToBr(null)).toBe(null);
      expect(DateHelper.dateToBr('string')).toBe(null);
    });
  });

  describe('brToDate', () => {
    it('deve converter data brasileira para Date', () => {
      const date = DateHelper.brToDate('15/03/1990');
      expect(date).toBeInstanceOf(Date);
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(2); // março = 2 (0-indexed)
      expect(date.getFullYear()).toBe(1990);
    });

    it('deve retornar null para valores vazios', () => {
      expect(DateHelper.brToDate(null)).toBe(null);
      expect(DateHelper.brToDate('')).toBe(null);
    });
  });
});
