import { parse } from "yaml";
import type Schema from "@/types/Schema";
import getBenchmarkEndpoint from "@/utils/getBenchmarkEndpoint";
import getVersionBaseUrl from "@/utils/getVersionBaseUrl";
import getBenchmarkSuite from "@/utils/getBenchmarkSuite";

export default async function getSchema(signal: AbortSignal): Promise<Schema> {
  try {
    const resp = await fetch(
      getBenchmarkEndpoint(`${getVersionBaseUrl()}/schema.json`),
      { signal },
    );

    return (await resp.json()) as Schema;
  } catch (error) {
    try {
      let url = getBenchmarkEndpoint(`${getVersionBaseUrl()}/`) + `schema.yaml`;
      const suite = getBenchmarkSuite();
      if (suite && url.includes(suite + "/benchmark_output/runs/")) {
        url = url.replace(suite + "/benchmark_output/runs/", "");
      }
      const resp = await fetch(url, { signal });
      const data = await resp.text();
      const schema = parse(data) as Schema;
      return schema;
    } catch (error) {
      console.log(error);
      return {
        adapter: [],
        metric_groups: [],
        metrics: [],
        models: [],
        perturbations: [],
        run_groups: [],
      } as Schema;
    }
  }
}
