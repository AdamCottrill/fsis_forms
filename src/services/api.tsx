export const getLots = async () => {
    const url = "stocking/api/v1/lots/";
    const payload = await fetch(url).then((res) =>  res.json());

  const { results } = payload;

  const results2 = results.map((x) => ({
    ...x,
    strain_slug: `${x.species_code}-${x.strain_code}`,
  }));
  return { ...payload, results: results2 };
};
