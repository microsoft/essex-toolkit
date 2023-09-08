/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TimeBrushProps } from './TimeBrush.types.js'
import { TimeBrush } from './TimeBrush.js'

const meta = {
	title: '@essex:components/TimeBrush',
	component: TimeBrush,
}
export default meta

const PrimaryComponent: React.FC<TimeBrushProps> = (args) => {
	return (
		<div style={{ display: 'flex', alignItems: 'center'}}>
			<TimeBrush
				{...args}
				search={""}
			/>
		</div>
	)
}

const defaultItems = [
	{
	 date: new Date("2019-12-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 178
	},
	{
	 date: new Date( "2019-12-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 733
	},
	{
	 date: new Date( "2019-12-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 101
	},
	{
	 date: new Date( "2019-12-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 452
	},
	{
	 date: new Date( "2019-12-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 292
	},
	{
	 date: new Date( "2019-12-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 285
	},
	{
	 date: new Date( "2019-12-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 145
	},
	{
	 date: new Date( "2019-12-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 279
	},
	{
	 date: new Date( "2019-12-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 447
	},
	{
	 date: new Date( "2019-12-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 586
	},
	{
	 date: new Date( "2019-12-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 235
	},
	{
	 date: new Date( "2019-12-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 183
	},
	{
	 date: new Date( "2019-12-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 234
	},
	{
	 date: new Date( "2019-12-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 396
	},
	{
	 date: new Date( "2019-12-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 120
	},
	{
	 date: new Date( "2019-12-30T00:00:00.000Z"),
	  term: "__documents__",
	  count: 479
	},
	{
	 date: new Date( "2019-12-31T00:00:00.000Z"),
	  term: "__documents__",
	  count: 5958
	},
	{
	 date: new Date( "2020-01-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 362
	},
	{
	 date: new Date( "2020-01-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 599
	},
	{
	 date: new Date( "2020-01-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 977
	},
	{
	 date: new Date( "2020-01-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 798
	},
	{
	 date: new Date( "2020-01-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1080
	},
	{
	 date: new Date( "2020-01-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1415
	},
	{
	 date: new Date( "2020-01-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1220
	},
	{
	 date: new Date( "2020-01-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1924
	},
	{
	 date: new Date( "2020-01-09T00:00:00.000Z"),
	  term: "__documents__",
	  count: 2396
	},
	{
	 date: new Date( "2020-01-10T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1193
	},
	{
	 date: new Date( "2020-01-11T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1522
	},
	{
	 date: new Date( "2020-01-12T00:00:00.000Z"),
	  term: "__documents__",
	  count: 666
	},
	{
	 date: new Date( "2020-01-13T00:00:00.000Z"),
	  term: "__documents__",
	  count: 2171
	},
	{
	 date: new Date( "2020-01-14T00:00:00.000Z"),
	  term: "__documents__",
	  count: 2291
	},
	{
	 date: new Date( "2020-01-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 1437
	},
	{
	 date: new Date( "2020-01-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 2946
	},
	{
	 date: new Date( "2020-01-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 3913
	},
	{
	 date: new Date( "2020-01-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 2736
	},
	{
	 date: new Date( "2020-01-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 3340
	},
	{
	 date: new Date( "2020-01-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 8697
	},
	{
	 date: new Date( "2020-01-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 20649
	},
	{
	 date: new Date( "2020-01-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 29379
	},
	{
	 date: new Date( "2020-01-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 36571
	},
	{
	 date: new Date( "2020-01-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 39681
	},
	{
	 date: new Date( "2020-01-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 22841
	},
	{
	 date: new Date( "2020-01-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 24934
	},
	{
	 date: new Date( "2020-01-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 46986
	},
	{
	 date: new Date( "2020-01-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 61588
	},
	{
	 date: new Date( "2020-01-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 62434
	},
	{
	 date: new Date( "2020-01-30T00:00:00.000Z"),
	  term: "__documents__",
	  count: 68559
	},
	{
	 date: new Date( "2020-01-31T00:00:00.000Z"),
	  term: "__documents__",
	  count: 41999
	},
	{
	 date: new Date( "2020-02-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 15799
	},
	{
	 date: new Date( "2020-02-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 17029
	},
	{
	 date: new Date( "2020-02-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 30213
	},
	{
	 date: new Date( "2020-02-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 32665
	},
	{
	 date: new Date( "2020-02-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 31817
	},
	{
	 date: new Date( "2020-02-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 30958
	},
	{
	 date: new Date( "2020-02-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 31537
	},
	{
	 date: new Date( "2020-02-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 13494
	},
	{
	 date: new Date( "2020-02-09T00:00:00.000Z"),
	  term: "__documents__",
	  count: 13569
	},
	{
	 date: new Date( "2020-02-10T00:00:00.000Z"),
	  term: "__documents__",
	  count: 28615
	},
	{
	 date: new Date( "2020-02-11T00:00:00.000Z"),
	  term: "__documents__",
	  count: 30380
	},
	{
	 date: new Date( "2020-02-12T00:00:00.000Z"),
	  term: "__documents__",
	  count: 28178
	},
	{
	 date: new Date( "2020-02-13T00:00:00.000Z"),
	  term: "__documents__",
	  count: 33610
	},
	{
	 date: new Date( "2020-02-14T00:00:00.000Z"),
	  term: "__documents__",
	  count: 27884
	},
	{
	 date: new Date( "2020-02-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 13760
	},
	{
	 date: new Date( "2020-02-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 12986
	},
	{
	 date: new Date( "2020-02-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 24216
	},
	{
	 date: new Date( "2020-02-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 31796
	},
	{
	 date: new Date( "2020-02-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 27021
	},
	{
	 date: new Date( "2020-02-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 30253
	},
	{
	 date: new Date( "2020-02-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 28920
	},
	{
	 date: new Date( "2020-02-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 14441
	},
	{
	 date: new Date( "2020-02-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 16238
	},
	{
	 date: new Date( "2020-02-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 37924
	},
	{
	 date: new Date( "2020-02-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 45050
	},
	{
	 date: new Date( "2020-02-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 56224
	},
	{
	 date: new Date( "2020-02-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 65989
	},
	{
	 date: new Date( "2020-02-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 72827
	},
	{
	 date: new Date( "2020-02-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 36157
	},
	{
	 date: new Date( "2020-03-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 35692
	},
	{
	 date: new Date( "2020-03-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 73465
	},
	{
	 date: new Date( "2020-03-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 85197
	},
	{
	 date: new Date( "2020-03-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 86299
	},
	{
	 date: new Date( "2020-03-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 91084
	},
	{
	 date: new Date( "2020-03-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 93608
	},
	{
	 date: new Date( "2020-03-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 48371
	},
	{
	 date: new Date( "2020-03-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 47465
	},
	{
	 date: new Date( "2020-03-09T00:00:00.000Z"),
	  term: "__documents__",
	  count: 109818
	},
	{
	 date: new Date( "2020-03-10T00:00:00.000Z"),
	  term: "__documents__",
	  count: 128790
	},
	{
	 date: new Date( "2020-03-11T00:00:00.000Z"),
	  term: "__documents__",
	  count: 161082
	},
	{
	 date: new Date( "2020-03-12T00:00:00.000Z"),
	  term: "__documents__",
	  count: 219471
	},
	{
	 date: new Date( "2020-03-13T00:00:00.000Z"),
	  term: "__documents__",
	  count: 200891
	},
	{
	 date: new Date( "2020-03-14T00:00:00.000Z"),
	  term: "__documents__",
	  count: 105223
	},
	{
	 date: new Date( "2020-03-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 86637
	},
	{
	 date: new Date( "2020-03-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 114062
	},
	{
	 date: new Date( "2020-03-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 249970
	},
	{
	 date: new Date( "2020-03-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 259248
	},
	{
	 date: new Date( "2020-03-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 255049
	},
	{
	 date: new Date( "2020-03-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 229910
	},
	{
	 date: new Date( "2020-03-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 131591
	},
	{
	 date: new Date( "2020-03-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 130441
	},
	{
	 date: new Date( "2020-03-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 243232
	},
	{
	 date: new Date( "2020-03-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 247098
	},
	{
	 date: new Date( "2020-03-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 268118
	},
	{
	 date: new Date( "2020-03-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 263079
	},
	{
	 date: new Date( "2020-03-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 234599
	},
	{
	 date: new Date( "2020-03-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 126208
	},
	{
	 date: new Date( "2020-03-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 125815
	},
	{
	 date: new Date( "2020-03-30T00:00:00.000Z"),
	  term: "__documents__",
	  count: 211947
	},
	{
	 date: new Date( "2020-03-31T00:00:00.000Z"),
	  term: "__documents__",
	  count: 226927
	},
	{
	 date: new Date( "2020-04-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 231895
	},
	{
	 date: new Date( "2020-04-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 221658
	},
	{
	 date: new Date( "2020-04-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 203668
	},
	{
	 date: new Date( "2020-04-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 112305
	},
	{
	 date: new Date( "2020-04-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 115902
	},
	{
	 date: new Date( "2020-04-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 218848
	},
	{
	 date: new Date( "2020-04-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 206274
	},
	{
	 date: new Date( "2020-04-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 202977
	},
	{
	 date: new Date( "2020-04-09T00:00:00.000Z"),
	  term: "__documents__",
	  count: 207743
	},
	{
	 date: new Date( "2020-04-10T00:00:00.000Z"),
	  term: "__documents__",
	  count: 175787
	},
	{
	 date: new Date( "2020-04-11T00:00:00.000Z"),
	  term: "__documents__",
	  count: 108709
	},
	{
	 date: new Date( "2020-04-12T00:00:00.000Z"),
	  term: "__documents__",
	  count: 100644
	},
	{
	 date: new Date( "2020-04-13T00:00:00.000Z"),
	  term: "__documents__",
	  count: 177688
	},
	{
	 date: new Date( "2020-04-14T00:00:00.000Z"),
	  term: "__documents__",
	  count: 213992
	},
	{
	 date: new Date( "2020-04-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 216718
	},
	{
	 date: new Date( "2020-04-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 221898
	},
	{
	 date: new Date( "2020-04-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 202272
	},
	{
	 date: new Date( "2020-04-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 104035
	},
	{
	 date: new Date( "2020-04-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 100614
	},
	{
	 date: new Date( "2020-04-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 197187
	},
	{
	 date: new Date( "2020-04-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 212159
	},
	{
	 date: new Date( "2020-04-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 213329
	},
	{
	 date: new Date( "2020-04-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 209639
	},
	{
	 date: new Date( "2020-04-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 210914
	},
	{
	 date: new Date( "2020-04-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 111209
	},
	{
	 date: new Date( "2020-04-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 102710
	},
	{
	 date: new Date( "2020-04-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 196751
	},
	{
	 date: new Date( "2020-04-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 210484
	},
	{
	 date: new Date( "2020-04-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 207472
	},
	{
	 date: new Date( "2020-04-30T00:00:00.000Z"),
	  term: "__documents__",
	  count: 213313
	},
	{
	 date: new Date( "2020-05-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 191397
	},
	{
	 date: new Date( "2020-05-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 93494
	},
	{
	 date: new Date( "2020-05-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 93421
	},
	{
	 date: new Date( "2020-05-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 189008
	},
	{
	 date: new Date( "2020-05-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 207766
	},
	{
	 date: new Date( "2020-05-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 207391
	},
	{
	 date: new Date( "2020-05-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 207694
	},
	{
	 date: new Date( "2020-05-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 178392
	},
	{
	 date: new Date( "2020-05-09T00:00:00.000Z"),
	  term: "__documents__",
	  count: 93961
	},
	{
	 date: new Date( "2020-05-10T00:00:00.000Z"),
	  term: "__documents__",
	  count: 95277
	},
	{
	 date: new Date( "2020-05-11T00:00:00.000Z"),
	  term: "__documents__",
	  count: 176198
	},
	{
	 date: new Date( "2020-05-12T00:00:00.000Z"),
	  term: "__documents__",
	  count: 192628
	},
	{
	 date: new Date( "2020-05-13T00:00:00.000Z"),
	  term: "__documents__",
	  count: 196194
	},
	{
	 date: new Date( "2020-05-14T00:00:00.000Z"),
	  term: "__documents__",
	  count: 191303
	},
	{
	 date: new Date( "2020-05-15T00:00:00.000Z"),
	  term: "__documents__",
	  count: 177411
	},
	{
	 date: new Date( "2020-05-16T00:00:00.000Z"),
	  term: "__documents__",
	  count: 90957
	},
	{
	 date: new Date( "2020-05-17T00:00:00.000Z"),
	  term: "__documents__",
	  count: 87909
	},
	{
	 date: new Date( "2020-05-18T00:00:00.000Z"),
	  term: "__documents__",
	  count: 173824
	},
	{
	 date: new Date( "2020-05-19T00:00:00.000Z"),
	  term: "__documents__",
	  count: 189853
	},
	{
	 date: new Date( "2020-05-20T00:00:00.000Z"),
	  term: "__documents__",
	  count: 185330
	},
	{
	 date: new Date( "2020-05-21T00:00:00.000Z"),
	  term: "__documents__",
	  count: 185297
	},
	{
	 date: new Date( "2020-05-22T00:00:00.000Z"),
	  term: "__documents__",
	  count: 161069
	},
	{
	 date: new Date( "2020-05-23T00:00:00.000Z"),
	  term: "__documents__",
	  count: 83214
	},
	{
	 date: new Date( "2020-05-24T00:00:00.000Z"),
	  term: "__documents__",
	  count: 80471
	},
	{
	 date: new Date( "2020-05-25T00:00:00.000Z"),
	  term: "__documents__",
	  count: 116441
	},
	{
	 date: new Date( "2020-05-26T00:00:00.000Z"),
	  term: "__documents__",
	  count: 171689
	},
	{
	 date: new Date( "2020-05-27T00:00:00.000Z"),
	  term: "__documents__",
	  count: 178390
	},
	{
	 date: new Date( "2020-05-28T00:00:00.000Z"),
	  term: "__documents__",
	  count: 184245
	},
	{
	 date: new Date( "2020-05-29T00:00:00.000Z"),
	  term: "__documents__",
	  count: 153614
	},
	{
	 date: new Date( "2020-05-30T00:00:00.000Z"),
	  term: "__documents__",
	  count: 77517
	},
	{
	 date: new Date( "2020-05-31T00:00:00.000Z"),
	  term: "__documents__",
	  count: 70962
	},
	{
	 date: new Date( "2020-06-01T00:00:00.000Z"),
	  term: "__documents__",
	  count: 126528
	},
	{
	 date: new Date( "2020-06-02T00:00:00.000Z"),
	  term: "__documents__",
	  count: 136037
	},
	{
	 date: new Date( "2020-06-03T00:00:00.000Z"),
	  term: "__documents__",
	  count: 146203
	},
	{
	 date: new Date( "2020-06-04T00:00:00.000Z"),
	  term: "__documents__",
	  count: 148479
	},
	{
	 date: new Date( "2020-06-05T00:00:00.000Z"),
	  term: "__documents__",
	  count: 135045
	},
	{
	 date: new Date( "2020-06-06T00:00:00.000Z"),
	  term: "__documents__",
	  count: 69306
	},
	{
	 date: new Date( "2020-06-07T00:00:00.000Z"),
	  term: "__documents__",
	  count: 63725
	},
	{
	 date: new Date( "2020-06-08T00:00:00.000Z"),
	  term: "__documents__",
	  count: 65601
	}
  ]

export const Primary = {
	render: (args: TimeBrushProps) => <PrimaryComponent {...args} />,
	args: {
		width: 800,
		height: 200,
		dateRange: [new Date("2019-12-15T00:00:00.000Z"), new Date("2020-06-08T00:00:00.000Z")],
		elements: defaultItems
	},
}