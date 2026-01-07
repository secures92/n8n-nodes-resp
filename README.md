# Untested: do not use

# n8n-nodes-resp

This is an n8n community node. It lets you use the **Resp** research engine in your n8n workflows.

Resp is a Python-based backend service that aggregates research papers from multiple sources like ACM, Arxiv, Google Scholar, and Semantic Scholar.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

*   **Search**: Query for research papers across multiple academic sources.
    *   **Filters**:
        *   **Source**: Filter by specific repository (ACM, Arxiv, Google Scholar, Semantic Scholar, or All).
        *   **Year**: Filter by `Min Year` and `Max Year`.
    *   **Pagination**: Use `Limit` and `Offset` to paging through results.

## Credentials

You need to have a running instance of the **Resp Search Backend**.

1.  In n8n, add a new credential type **Resp API**.
2.  Enter the **Base URL** of your deployed Resp instance (e.g., `http://your-server-ip:5000`).

## Compatibility

*   n8n: 1.0.0+
*   Node: v18+

## Usage

### Search for AI Papers
1.  Add the **Resp Search** node to your workflow.
2.  Set **Query** to `Artificial Intelligence`.
3.  Set **Source** to `Arxiv`.
4.  Set **Min Year** to `2023`.
5.  Execute the node to get a list of recent AI papers.

### Pagination Pattern
Since the node returns individual items (one per paper), you can easily process them. To fetch more pages:
*   Use the `Offset` parameter controlled by an expression (e.g., from a Loop node) to fetch subsequent pages of results.

## Resources

*   [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
*   [Resp Backend Repository](https://github.com/secures92/resp-serve)
