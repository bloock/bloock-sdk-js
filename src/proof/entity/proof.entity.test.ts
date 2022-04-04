import { Anchor } from '../../anchor/entity/anchor.entity'
import { Network } from '../../anchor/entity/network.entity'
import { Proof } from './proof.entity'

describe('Proof entity tests', () => {
  it('test_is_valid_okay', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '0004000600060005',
      'bfdf7000',
      anchor
    )
    expect(Proof.isValid(proof)).toBeTruthy()
  })

  it('test_is_valid_minimalist', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
      [],
      '0004',
      'bf',
      anchor
    )
    expect(Proof.isValid(proof)).toBeTruthy()
  })

  it('test_is_valid_leaves_not_hex', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aeeg'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '000400060006000500030002000400060007000800090009',
      'bfdf7000',
      anchor
    )
    expect(Proof.isValid(proof)).toBeFalsy()
  })

  it('test_is_valid_nodes_not_hex', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aeea'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeag',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '000400060006000500030002000400060007000800090009',
      'bfdf7000',
      anchor
    )
    expect(Proof.isValid(proof)).toBeFalsy()
  })

  it('test_is_valid_bitmap_too_short', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee',
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee',
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '0004000600060005000600060005000600060005',
      'bf',
      anchor
    )
    expect(Proof.isValid(proof)).toBeFalsy()
  })

  it('test_is_valid_depth_too_short', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '000400060006000',
      'bfdf7000',
      anchor
    )
    expect(Proof.isValid(proof)).toBeFalsy()
  })

  it('test_is_valid_depth_too_long', () => {
    const network = new Network("bloock_chain", "Confirmed", "0x82a2226903e043750cd57e2f64281f8a800e4fe524661861a1fab7b00692b4a5")
    const anchor = new Anchor(35554, [""], [network], "9a09a4e4f831092c64e48ba23faf2f809f12f27e99440ca1e4991dd945391695", "Success")
    const proof = new Proof(
      ['02aae7e86eb50f61a62083a320475d9d60cbd52749dbf08fa942b1b97f50aee5'],
      [
        'bb6986853646d083929d1d92638f3d4741a3b7149bd2b63c6bfedd32e3c684d3',
        '0616067c793ac533815ae2d48d785d339e0330ce5bb5345b5e6217dd9d1dbeab',
        '68b8f6b25cc700e64ed3e3d33f2f246e24801f93d29786589fbbab3b11f5bcee'
      ],
      '0004000600060',
      'bfdf7000',
      anchor
    )
    expect(Proof.isValid(proof)).toBeFalsy()
  })
})
