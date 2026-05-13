type CommandeArticlePayload = {
  id: string;
  quantite: number;
};

type PostCommandesPayload = {
  festivalierId?: string;
  articles?: unknown;
};

type SavedOrder = {
  id: string;
  festivalierId: string;
  articles: CommandeArticlePayload[];
  statut: string;
};

type CreatePostCommandesHttpHandlerDependencies = {
  festivalGoerRepository: {
    findById(id: string): Promise<{ id: string }>;
  };
  articleRepository: {
    findAvailableById(id: string): Promise<{
      id: string;
      article: string;
      quantiteDisponible: number;
    }>;
  };
  orderRepository: {
    nextId(): string;
    save(order: SavedOrder): Promise<void>;
  };
};

const isCommandeArticlePayload = (
  value: unknown,
): value is CommandeArticlePayload => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' && typeof candidate.quantite === 'number'
  );
};

const isPostCommandesPayloadValid = (
  payload: PostCommandesPayload,
): payload is { festivalierId: string; articles: CommandeArticlePayload[] } => {
  return (
    typeof payload.festivalierId === 'string' &&
    Array.isArray(payload.articles) &&
    payload.articles.every(isCommandeArticlePayload)
  );
};

export const createPostCommandesHttpHandler = (
  dependencies: CreatePostCommandesHttpHandlerDependencies,
) => {
  return async (request: Request): Promise<Response> => {
    const payload = (await request.json()) as PostCommandesPayload;

    if (typeof payload.festivalierId !== 'string') {
      return new Response(null, { status: 401 });
    }

    if (!isPostCommandesPayloadValid(payload)) {
      return new Response(null, { status: 400 });
    }

    const commandeId = dependencies.orderRepository.nextId();

    await dependencies.orderRepository.save({
      id: commandeId,
      festivalierId: payload.festivalierId,
      articles: payload.articles,
      statut: 'EN_ATTENTE',
    });

    return new Response(JSON.stringify({ commandeId }), {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    });
  };
};