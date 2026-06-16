import chromadb
from pathlib import Path


from services.embedding_service import generate_embedding

from services.pdf_service import (
    extract_text_from_pdf,
    chunk_text
)


BASE_DIR = Path(__file__).resolve().parent.parent

CHROMA_PATH = BASE_DIR / "chroma_db"

client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)
print("Chroma Path:", CHROMA_PATH)

collection = client.get_or_create_collection(
    name="energy_docs"
)


def index_pdf():
    print("Indexing started")
    print("Collection count before indexing:", collection.count())
    if collection.count() > 0:

        print("PDF already indexed")

        return

    text = extract_text_from_pdf(
        "./data/energy.pdf"
    )

    print("PDF Text Length:", len(text))

    chunks = chunk_text(text)
    print("Chunks Created:", len(chunks))

    for i, chunk in enumerate(chunks):

        embedding = generate_embedding(chunk)

        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[str(i)]
        )

    print("PDF indexed successfully")


def retrieve_chunks(question):

    question_embedding = generate_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    print("\nQUESTION:")
    print(question)

    print("\nRETRIEVED CHUNKS:")
    for chunk in results["documents"][0]:
        print("-" * 50)
        print(chunk[:500])

    return results["documents"][0]