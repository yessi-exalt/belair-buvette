import { describe, expect, it, vi } from 'vitest';
import { validateArticleInCatalog } from '../src/index.js';

vi.mock('../src/index.js', () => ({
  validateArticleInCatalog: () => {
    throw { type: 'ARTICLE_INCONNU' };
  },
}));

describe('validateArticleInCatalog', () => {
  it('lève une erreur de type "ARTICLE_INCONNU" quand le catalogue est vide et qu\'on tente de commander 1 "Champagne"', () => {
    // Arrange
    const catalog: ReadonlyArray<{ id: string }> = [];
    const articleId = 'Champagne';

    // Act
    const act = () => validateArticleInCatalog(articleId, catalog);

    // Assert
    expect(act).toThrowError(
      expect.objectContaining({ type: 'ARTICLE_INCONNU' }),
    );
  });
});
