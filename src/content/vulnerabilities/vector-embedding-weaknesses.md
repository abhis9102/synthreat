---
title: Vector and Embedding Weaknesses
surface: "AI Security"
owasp: "LLM08:2025 – Vector and Embedding Weaknesses"
summary: A retrieval-augmented system's vector database inherits the access-control and integrity risks of any other database, while typically getting far less security scrutiny.
cwe: ["CWE-668"]
typicalSeverityCeiling: Critical
related: ["cross-tenant-isolation-failure", "ai-sensitive-information-disclosure"]
status: published
datePublished: 2026-09-18
---

## Definition

Vector and embedding weaknesses cover the security gaps specific to retrieval-augmented generation
(RAG): systems that search a vector database of embeddings (numeric representations of documents or
data) to find content relevant to a query, then feed that content into a model as context. The
weaknesses show up in how that vector store is populated, queried, and isolated: content can be
retrieved across boundaries it shouldn't cross, maliciously crafted documents can be planted to be
retrieved for unrelated queries, and the embeddings themselves can sometimes be reversed back toward
the sensitive text they were derived from.

## The Trust Boundary That Breaks

A RAG system is built on the assumption that the vector store enforces the same access boundaries as
whatever primary system its content came from: if a user couldn't read a document directly, the
system shouldn't retrieve that document's content into their conversation either. Vector database
tooling is newer than traditional database access-control tooling, and it's common for a team to wire
up retrieval quickly without carrying that same per-document or per-tenant access boundary into the
vector layer, leaving the vector store answering any query with whatever content is most semantically
relevant, access rights notwithstanding.

A second, distinct assumption also breaks here: that an embedding is a safe, effectively anonymized
representation of its source text. Embeddings are a lossy but not meaningless transformation, and
under some conditions the original text, or something close enough to it to be sensitive, can be
reconstructed from the embedding vector alone.

## Where It Actually Shows Up

- A shared vector index serving multiple tenants or departments with no per-document access filter
  applied at retrieval time, letting one user's query surface another tenant's or department's
  content, the same underlying failure as [Cross-Tenant Isolation
  Failure](../cross-tenant-isolation-failure/) specific to the RAG layer.
- Embedding poisoning: a malicious document deliberately crafted and inserted into a knowledge base so
  it gets retrieved for a wide range of unrelated queries, functioning as a delivery mechanism for
  [Prompt Injection](../prompt-injection/) at scale across many users' conversations.
- Ingestion pipelines that embed and index new content with no validation of its source or content,
  letting anyone who can contribute to the underlying knowledge base influence what future queries
  retrieve.
- An API or debugging interface that exposes raw embedding vectors, which can, under some
  circumstances, be used to approximate the original sensitive text they were generated from without
  ever accessing the source document directly.

## Why It Keeps Happening

RAG pipelines are typically built quickly on top of a vector database library chosen for its search
quality and performance, with access control treated as something the application layer around it
will handle later. That "later" step is easy to skip specifically because a RAG system without
per-document filtering still works correctly from a pure functionality standpoint. It answers queries
well; it simply doesn't check whether the person asking was ever allowed to see the specific documents
it's now surfacing.

## How to Find It

1. Test cross-tenant and cross-user retrieval directly: as one authenticated test user, ask questions
   specifically designed to surface content that should only be reachable by a different test account,
   using only accounts created for the assessment.
2. Review whether document-level access control is actually enforced as part of the retrieval query
   itself, rather than only checked at the point a user browses the source system the documents
   originally came from.
3. Test whether a document deliberately inserted into the knowledge base for this purpose gets
   retrieved for queries unrelated to its actual content, indicating the ingestion or ranking pipeline
   lacks safeguards against this kind of manipulation.
4. Review whether raw embedding vectors are ever exposed through an API or logging output that a user
   or lower-privileged caller could access directly.

## Impact by Scenario

| Scenario | Realistic impact |
|---|---|
| Vector store holds only already-public content with no per-document sensitivity | Low; limited real exposure |
| Cross-tenant retrieval surfaces non-sensitive internal content | Medium; a real but bounded confidentiality gap |
| Cross-tenant retrieval surfaces sensitive customer or business data | Critical; a direct data breach through the retrieval layer |
| A planted document successfully injects instructions into unrelated users' conversations at scale | Critical; a scalable indirect prompt injection delivery mechanism |

## Why a Business Should Care

RAG is often adopted specifically to make an AI feature more accurate and more useful by grounding it
in an organization's own real data, which is exactly why the access-control gap here matters so much:
the more valuable and sensitive the data a RAG system is built on, the more valuable and sensitive
whatever it retrieves incorrectly becomes. The useful framing for a client building a RAG feature is
that the vector database deserves the same access-control rigor as the original data source it was
built from, not a lighter version of it just because the interface in front of it is a chat window
instead of a traditional search or document viewer.

## A Worked Example

*(Generalized from real assessment patterns. Company and identifiers below are invented; no real
system or data is referenced.)*

Vantara Systems' internal knowledge assistant retrieves from a shared vector index built from
documents across multiple departments, with no per-department filter applied at query time. Using a
test account provisioned for one department, a query phrased to resemble the likely content of another
department's internal planning documents (created as test content for this assessment and inserted
into the index specifically for this purpose) is retrieved and summarized in the assistant's response,
confirming the retrieval layer applies no department-level access boundary.

Testing confirms retrieval of the planted test document only. No real departmental document is
targeted or referenced, and access is limited to test accounts and test content created for this
assessment.

## Severity Calibration

This rates **Critical** because the retrieval layer demonstrated no access boundary at all between
departments, meaning any real sensitive document indexed for one department would be retrievable by
any other, with no additional technique required beyond an ordinary query. A vector store containing
only low-sensitivity, broadly-shared content, with the same missing filter, would rate meaningfully
lower: severity tracks what's actually retrievable across the boundary, not the mere absence of a
filter in the abstract.

## Remediation

The real fix is enforcing document-level access control as part of the retrieval query itself, the
same principle as any other data-access boundary, filtering by the requesting user's actual
permissions before content is ever passed to the model as context, combined with validating and
reviewing ingested content before it's indexed to reduce the risk of embedding poisoning.

The common bad fix is relying on the application's authentication layer alone (the user is logged in,
therefore anything the assistant retrieves is assumed fine) without a corresponding per-document
authorization check at the retrieval layer itself. Being authenticated to the application and being
authorized to see a specific document are different questions, the same distinction [Broken Access
Control](../broken-access-control/) exists to make generally.

## Related Classes

- **Cross-Tenant Isolation Failure** ([../cross-tenant-isolation-failure/](../cross-tenant-isolation-failure/)):
  the same underlying missing-boundary pattern, applied generally across a multi-tenant platform
  rather than specifically at the RAG retrieval layer.
- **AI Sensitive Information Disclosure** ([../ai-sensitive-information-disclosure/](../ai-sensitive-information-disclosure/)):
  the broader disclosure outcome this class is one specific, retrieval-layer mechanism for reaching.
