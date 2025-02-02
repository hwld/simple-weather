import { test, expect } from "next/experimental/testmode/playwright";
import { mockForecastResponse, mockLocation } from "./mocks";
import { Routes } from "@/routes";
import {
  WeatherApiErrorResopnse,
  ForecastResponse,
  SearchResponse,
  WeatherAPIErrorCode,
} from "@/backend/weather/schema";
import { format } from "date-fns";
import { createWeatherApiFetchHandler } from "./utils";

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
        createWeatherApiFetchHandler({
          forecastResponse: new Response(
            JSON.stringify(mockForecastResponse satisfies ForecastResponse)
          ),
          searchResponse: new Response(
            JSON.stringify([mockLocation] satisfies SearchResponse)
          ),
        })
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
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(null, { status: 500 }),
      })
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
      dialog.getByText("エラーが発生しました", { exact: false })
    ).toBeVisible();
  });

  test("地域が見つからない場合は、ダイアログの中に「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        searchResponse: new Response(
          JSON.stringify([] satisfies SearchResponse)
        ),
      })
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

    await expect(
      page.getByText("検索してください", { exact: false })
    ).toBeVisible();
  });
});

test.describe("現在の天気ページ", () => {
  test("検索した地域の天気情報が取得できた場合は地域名が存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(
          JSON.stringify(mockForecastResponse satisfies ForecastResponse)
        ),
      })
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    await expect(
      page.getByText(mockForecastResponse.location.name, { exact: false })
    ).toBeVisible();
  });

  test("検索した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(
          JSON.stringify({
            error: { code: WeatherAPIErrorCode.LocationNotFound },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        ),
      })
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    await expect(
      page.getByText("見つかりませんでした", { exact: false })
    ).toBeVisible();
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(null, { status: 500 }),
      })
    );

    await page.goto(Routes.weatherSummary({ locationId: "dummy" }));

    await expect(
      page.getByText("エラーが発生しました", { exact: false })
    ).toBeVisible();
  });
});

test.describe("指定日の天気ページ", () => {
  test("指定した地域と日時の天気予報が取得できた場合は地域名と日時が見出しに存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(
          JSON.stringify(mockForecastResponse satisfies ForecastResponse)
        ),
      })
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    const locationName = mockForecastResponse.location.name;
    await expect(
      page.getByRole("heading", {
        name: locationName,
        exact: false,
      })
    ).toBeVisible();

    const date = format(
      mockForecastResponse.forecast.forecastday[0].date,
      "M月d日"
    );
    await expect(
      page.getByRole("heading", {
        name: date,
        exact: false,
      })
    ).toBeVisible();
  });

  test("指定した地域が見つからなかった場合には「見つかりませんでした」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(
          JSON.stringify({
            error: { code: WeatherAPIErrorCode.LocationNotFound },
          } satisfies WeatherApiErrorResopnse),
          { status: 400 }
        ),
      })
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    await expect(
      page.getByText("見つかりませんでした", { exact: false })
    ).toBeVisible();
  });

  test("日時が正しく指定されていなければ「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(() => "abort");

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "wrong" })
    );

    await expect(
      page.getByText("エラーが発生しました", { exact: false })
    ).toBeVisible();
  });

  test("APIでエラーが発生している場合は「エラーが発生しました」というテキストが存在する", async ({
    next,
    page,
  }) => {
    next.onFetch(
      createWeatherApiFetchHandler({
        forecastResponse: new Response(null, { status: 500 }),
      })
    );

    await page.goto(
      Routes.weatherDetail({ locationId: "dummy", date: "1970-01-01" })
    );

    await expect(
      page.getByText("エラーが発生しました", { exact: false })
    ).toBeVisible();
  });
});
