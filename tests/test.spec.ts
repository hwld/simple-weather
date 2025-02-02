import {
  test,
  expect,
  NextFixture,
} from "next/experimental/testmode/playwright";
import {
  mockCurrentWeather,
  mockForecast,
  mockForecastLocation,
  mockLocation,
} from "./mocks";
import { Routes } from "@/routes";
import {
  WeatherApiErrorResopnse,
  ForecastResponse,
  SearchResponse,
} from "@/backend/weather/schema";
import { ForecastApiUrl, SearchApiUrl } from "@/backend/weather/url";

const createFetchHandler: (
  mocks: {
    url: string;
    response: Response;
  }[]
) => Parameters<NextFixture["onFetch"]>[0] = (mocks) => {
  return (req) => {
    const url = new URL(req.url);
    url.search = "";

    for (const mock of mocks) {
      if (url.toString() === mock.url) {
        return mock.response;
      }
    }

    return "abort";
  };
};

const createForecastFetchHandler: (
  response: Response
) => Parameters<NextFixture["onFetch"]>[0] = (response) => {
  return (req) => {
    const url = new URL(req.url);
    url.search = "";
    if (url.toString() === ForecastApiUrl) {
      return response;
    }
    return "abort";
  };
};

const createSearchFetchHandler: (
  response: Response
) => Parameters<NextFixture["onFetch"]>[0] = (response) => {
  return (req) => {
    const url = new URL(req.url);
    url.search = "";
    if (url.toString() === SearchApiUrl) {
      return response;
    }
    return "abort";
  };
};

test.describe("検索ダイアログ", () => {
  (
    [
      {
        fromPage: "ホーム",
        fromPath: () => Routes.home(),
        expectedPage: "現在の天気",
        expectedPath: (id) =>
          Routes.weatherSummary({
            locationId: id,
          }),
      },
      {
        fromPage: "現在の天気",
        fromPath: (id) =>
          Routes.weatherSummary({
            locationId: `${id}`,
          }),
        expectedPage: "現在の天気",
        expectedPath: (id) =>
          Routes.weatherSummary({
            locationId: `${id}`,
          }),
      },
      {
        fromPage: "指定日の天気",
        fromPath: (id, date) => Routes.weatherDetail({ locationId: id, date }),
        expectedPage: "指定日の天気",
        expectedPath: (id, date) =>
          Routes.weatherDetail({
            locationId: id,
            date,
          }),
      },
    ] satisfies {
      fromPage: string;
      fromPath: (locationId: string, date: string) => string;
      expectedPage: string;
      expectedPath: (locationId: string, date: string) => string;
    }[]
  ).forEach(({ fromPage, fromPath, expectedPage, expectedPath }) => {
    test(`${fromPage}ページから検索して地域をクリックすると、その地域の${expectedPage}ページに遷移する`, async ({
      next,
      page,
    }) => {
      next.onFetch(
        createFetchHandler([
          {
            url: ForecastApiUrl,
            response: new Response(
              JSON.stringify({
                location: mockLocation,
                current: mockCurrentWeather,
                forecast: mockForecast,
              } satisfies ForecastResponse)
            ),
          },
          {
            url: SearchApiUrl,
            response: new Response(
              JSON.stringify([mockLocation] satisfies SearchResponse)
            ),
          },
        ])
      );

      const date = "1970-01-01";

      await page.goto(fromPath(`${mockLocation.id}`, date));

      // 検索ダイアログを開く
      const searchButton = page.getByRole("button", { name: /検索/i });
      await searchButton.click();

      // 検索したい地域を入力する
      const input = page.getByRole("combobox");
      await input.fill("dummy location");

      // APIから返ってきた地域名が含まれているリンクを取得する
      const searchedLocation = page.getByRole("link", {
        name: mockLocation.name,
      });

      // クリックして遷移するかを確認する
      await searchedLocation.click();
      await expect(page).toHaveURL(expectedPath(`${mockLocation.id}`, date));
    });
  });

  test("APIでエラーが発生している場合は、ダイアログの中に「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(createSearchFetchHandler(new Response(null, { status: 500 })));

    await page.goto(Routes.home());

    // 検索ダイアログを開く
    const searchButton = page.getByRole("button", { name: /検索/i });
    await searchButton.click();

    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });

    // 検索したい地域を入力する
    const input = dialog.getByRole("combobox");
    await input.fill("dummy location");

    await expect(
      dialog.getByText("エラーが発生しました", { exact: false })
    ).toBeVisible();
  });

  test("地域が見つからない場合は、ダイアログの中に「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createSearchFetchHandler(
        new Response(JSON.stringify([] satisfies SearchResponse))
      )
    );

    await page.goto(Routes.home());

    // 検索ダイアログを開く
    const searchButton = page.getByRole("button", { name: /検索/i });
    await searchButton.click();

    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });

    // 検索したい地域を入力する
    const input = dialog.getByRole("combobox");
    await input.fill("dummy location");

    await expect(
      dialog.getByText("見つかりませんでした", { exact: false })
    ).toBeVisible();
  });
});

test.describe("ホームページ", () => {
  test("「検索してください」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(() => "abort");

    await page.goto(Routes.home());

    expect(
      await page.getByText("検索してください", { exact: false }).count()
    ).toBeGreaterThan(0);
  });
});

test.describe("現在の天気ページ", () => {
  test("検索した地域の天気情報が取得できた場合は地域名が存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(
        new Response(
          JSON.stringify({
            location: mockForecastLocation,
            current: mockCurrentWeather,
            forecast: mockForecast,
          } satisfies ForecastResponse)
        )
      )
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    expect(
      await page.getByText(mockForecastLocation.name, { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("検索した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(
        new Response(
          JSON.stringify({
            error: { code: 1006 },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        )
      )
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    expect(
      await page.getByText("見つかりませんでした", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(new Response(null, { status: 500 }))
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });
});

test.describe("指定日の天気ページ", () => {
  test("指定した地域と日時の天気予報が取得できた場合は地域名と日時が存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(
        new Response(
          JSON.stringify({
            location: mockForecastLocation,
            current: mockCurrentWeather,
            forecast: mockForecast,
          } satisfies ForecastResponse)
        )
      )
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    expect(
      await page.getByText(mockForecastLocation.name, { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("指定した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(
        new Response(
          JSON.stringify({
            error: { code: 1006 },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        )
      )
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    expect(
      await page.getByText("見つかりませんでした", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("日時が正しく指定されていなければ「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(() => "abort");

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "wrong" })
    );

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createForecastFetchHandler(new Response(null, { status: 500 }))
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    expect(
      await page.getByText("エラーが発生しました", { exact: false }).count()
    ).toBeGreaterThan(0);
  });
});
