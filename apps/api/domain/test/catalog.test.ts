import { describe, expect, it } from 'vitest';
import { validateArticleInCatalog } from '../src/index.js';

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
