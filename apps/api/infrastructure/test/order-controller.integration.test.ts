import { describe, expect, it } from 'vitest';

import { createPostCommandesHttpHandler } from '../src/index.js';

class FakeFestivalGoerRepository {
  public async findById(id: string): Promise<{ id: string }> {
    return { id };
  }
}

class FakeArticleRepository {
  public async findAvailableById(id: string): Promise<{
    id: string;
    article: string;
    quantiteDisponible: number;
  }> {
    const articles = {
      mojito: {
        id: 'mojito',
        article: 'Mojito',
        quantiteDisponible: 10,
      },
      'eau-plate': {
        id: 'eau-plate',
        article: 'Eau plate',
        quantiteDisponible: 50,
      },
    } as const;

    const article = articles[id as keyof typeof articles];

    if (!article) {
      throw new Error(`Unknown article in test double: ${id}`);
    }

    return article;
  }
}

class FakeOrderRepository {
  public savedOrder:
    | {
        id: string;
        festivalierId: string;
        articles: Array<{ id: string; quantite: number }>;
        statut: string;
      }
    | undefined;

  public nextId(): string {
    return 'commande-123';
  }

  public async save(order: {
    id: string;
    festivalierId: string;
    articles: Array<{ id: string; quantite: number }>;
    statut: string;
  }): Promise<void> {
    this.savedOrder = order;
  }
}

describe('OrderController', () => {
  it('Scenario: Commande créée avec succès', async () => {
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const handlePostCommandes = createPostCommandesHttpHandler({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    const request = new Request('http://belair.test/commandes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        festivalierId: 'festivalier-42',
        articles: [{ id: 'mojito', quantite: 2 }],
      }),
    });

    const response = await handlePostCommandes(request);
    const body = (await response.json()) as { commandeId: string };

    expect(response.status).toBe(201);
    expect(body.commandeId).not.toBe('');
    expect(orderRepository.savedOrder).toEqual({
      id: body.commandeId,
      festivalierId: 'festivalier-42',
      articles: [{ id: 'mojito', quantite: 2 }],
      statut: 'EN_ATTENTE',
    });
  });

  it("Scenario: Requête refusée si le festivalier n'est pas authentifié", async () => {
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const handlePostCommandes = createPostCommandesHttpHandler({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    const request = new Request('http://belair.test/commandes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        articles: [{ id: 'mojito', quantite: 2 }],
      }),
    });

    const response = await handlePostCommandes(request);

    expect(response.status).toBe(401);
  });

  it('Scenario: Requête refusée si le corps de la requête est invalide', async () => {
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const handlePostCommandes = createPostCommandesHttpHandler({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    const request = new Request('http://belair.test/commandes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        festivalierId: 'festivalier-42',
      }),
    });

    const response = await handlePostCommandes(request);

    expect(response.status).toBe(400);
  });
});